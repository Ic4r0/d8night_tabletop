import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/store.model';
import { Observable, of, Subscription } from 'rxjs';
import { getCampaignCurrent, getUsersList } from 'src/app/store/store.reducer';
import { User } from 'src/app/store/users/users.model';
import { Title } from '@angular/platform-browser';
import { CustomToastrService } from '../../shared/custom-toastr/custom-toastr.service';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Campaign } from 'src/app/store/campaigns/campaigns.model';
import { BreadcrumbItems } from '../../shared/models/breadcrumb-items/breadcrumb-items.model';
import { v4 as uuidv4 } from 'uuid';
import { AngularFireStorage } from '@angular/fire/storage';
import { catchError, finalize, first, mergeMap, tap } from 'rxjs/operators';
import { CampaignsApiService } from 'src/app/services/campaigns-api.service';
import { newCampaign, updateCampaign } from 'src/app/store/campaigns/campaigns.actions';
import { ModalComponent } from '../../shared/modal/modal.component';

declare var UIkit: any;

@Component({
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.scss']
})
export class EditCampaignComponent implements OnInit, OnDestroy {
  @ViewChild('imgUpload', {static: true}) imgUpload: ElementRef;
  @ViewChild('warningPictureChange', {static: true}) warningPictureChange: ModalComponent;

  subs: Array<Subscription> = [];
  usersList: Array<User>;
  currentCampaign: Campaign = null;

  campaignName: string;
  dungeonMaster: User;
  campaignImageUrl: Observable<string>;
  players: Array<User>;
  campaignImage: Blob;

  originalPlayers: Array<User>;

  saveButton = false;

  loading = false;

  imgUploaded: File;
  tempImgUploaded: File;
  croppedImageBase64: any;
  showImageCropper = false;

  breadcrumb: Array<BreadcrumbItems> = [
    { path: '/home', name: 'Home' },
    { path: '/campaigns', name: 'Campaigns' },
    { path: '', name: 'New campaign' }
  ];

  footerButtons: { icon: string, text: string, label: string }[] = [
    { icon: 'refresh', text: 'Cancel', label: 'cancel' },
    { icon: 'file-edit', text: 'Save', label: 'save' }
  ];

  constructor(private titleService: Title,
              private store: Store<AppState>,
              private toastr: CustomToastrService,
              private location: Location,
              private router: Router,
              private storage: AngularFireStorage,
              private campaignService: CampaignsApiService) {
    this.titleService.setTitle('Nuova campagna - d8 Night');
  }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(getUsersList).subscribe((list) => {
        this.usersList = [...list];
      }),
      this.store.select(getCampaignCurrent).subscribe((currCampaign) => {
        if (!!currCampaign) {
          this.breadcrumb = [
            { path: '/home', name: 'Home' },
            { path: '/campaigns', name: 'Campaigns' },
            {
              path: '/campaigns/' + currCampaign.id,
              name: currCampaign.name
            },
            { path: '', name: 'Edit' }
          ];
          this.currentCampaign = {...currCampaign};
          this.campaignName = this.currentCampaign.name;
          this.dungeonMaster = this.currentCampaign.master;
          this.originalPlayers = [...this.currentCampaign.players];
          this.players = [...this.currentCampaign.players];
          this.campaignImageUrl = this.storage.ref(this.currentCampaign.pic).getDownloadURL();
        }
      })
    );

    UIkit.upload(this.imgUpload.nativeElement, {
      url: '',
      multiple: false,
      method: () => false
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  checkPlayers() {
    return !(!!this.players && this.players.length > 0);
  }

  onFileUpload(fileArray: any) {
    if (fileArray && fileArray.length > 0) {
      const file = fileArray[0][0];
      if (file.type.toLowerCase().includes('image')) {
        if (!!this.currentCampaign && !this.showImageCropper) {
          this.tempImgUploaded = file;
          this.warningPictureChange.show();
        } else {
          this.imgUploaded = file;
        }
      } else {
        this.toastr.warning(
          'The uploaded file is not an image',
          'Warning'
        );
      }
    }
  }

  cancelNewPicture() {
    this.tempImgUploaded = undefined;
    this.warningPictureChange.hide();
  }

  changePicture() {
    this.imgUploaded = this.tempImgUploaded;
    this.warningPictureChange.hide();
  }

  imageLoaded() {
    this.showImageCropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageBase64 = event.base64;
    this.campaignImage = base64ToFile(event.base64);
  }

  onSaveClick() {
    if (!!this.campaignName && !!this.dungeonMaster && (!!this.campaignImage || !!this.currentCampaign) && this.players.length > 0) {
      this.loading = true;
      const campaignId: string = !!this.currentCampaign ? this.currentCampaign?.id : uuidv4();
      const filePath: string = 'campaignsPictures/' + campaignId;
      if (!!this.campaignImage) {
        const task = this.storage.upload(filePath, this.campaignImage);
        this.subs.push(
          task.snapshotChanges().pipe(
            finalize(() => {
              this.loading = false;
              this.saveCampaign({
                id: campaignId,
                name: this.campaignName,
                pic: filePath,
                master: this.dungeonMaster,
                players: this.players,
                sheetSharing: this.currentCampaign?.sheetSharing || null,
              });
            }),
            catchError((err) => {
              this.loading = false;
              this.toastr.error(err);
              return of(err);
            })
          ).subscribe()
        );
      } else {
        this.loading = false;
        this.saveCampaign({
          id: campaignId,
          name: this.campaignName,
          pic: filePath,
          master: this.dungeonMaster,
          players: this.players,
          sheetSharing: this.currentCampaign?.sheetSharing || null,
        });
      }
    } else {
      this.saveButton = true;
    }
  }

  saveCampaign(campaignToSave: Campaign) {
    this.scrollToTop();
    this.loading = true;
    if (!!this.currentCampaign && this.checkDeletedPlayers()) {
      let usersIdx: string[] = [];
      let sheetsIdx: string[] = [];
      const newSheetSharing = {};
      this.originalPlayers.forEach((orig) => {
        if (this.players.every((player) => player.uid !== orig.uid)) {
          usersIdx = [
            ...usersIdx,
            orig.uid
          ];
        }
      });
      Object.keys(this.currentCampaign.sheetSharing).forEach((key) => {
        const player = this.currentCampaign.sheetSharing[key].player;
        const sharedWith = this.currentCampaign.sheetSharing[key].sharedWith;
        if (usersIdx.some((idx) => idx ===  player.uid)) {
          sheetsIdx = [
            ...sheetsIdx,
            key
          ];
        } else {
          newSheetSharing[key] = {
            ...this.currentCampaign.sheetSharing[key],
            sharedWith: sharedWith.filter(({uid}) => usersIdx.every((idx) => idx !== uid))
          };
        }
      });
      const newOrUpdatedCampaign: Campaign = {
        ...campaignToSave,
        sheetSharing: { ...newSheetSharing }
      };
      this.campaignService.removePlayersSheets(campaignToSave.id, sheetsIdx).pipe(
        first(),
        mergeMap(() => this.campaignService.updateCampaign(newOrUpdatedCampaign).pipe(first())),
        tap(() => {
          if (Object.keys(this.currentCampaign.sheets).length > 0) {
            sheetsIdx.forEach((idx) => {
              if (idx in this.currentCampaign.sheets) {
                delete this.currentCampaign.sheets[idx];
              }
            });
          }
          const campaign: Campaign = {
            ...newOrUpdatedCampaign,
            sheets: this.currentCampaign.sheets
          };
          this.loading = false;
          this.store.dispatch(updateCampaign({ campaign }));
          this.router.navigate(['/campaigns/' + campaign.id]);
        }),
        catchError((err) => {
          if (!(!!this.currentCampaign)) {
            this.storage.ref(campaignToSave.pic).delete();
          }
          this.loading = false;
          this.toastr.error(err);
          return of(err);
        })
      ).subscribe();
    } else {
      this.campaignService.updateCampaign(campaignToSave)
      .pipe(
        first(),
        tap(() => {
          const campaign: Campaign = {
            ...campaignToSave,
            sheets: this.currentCampaign.sheets
          };
          if (!!this.currentCampaign) {
            this.store.dispatch(updateCampaign({ campaign }));
          } else {
            this.store.dispatch(newCampaign({ campaign }));
          }
          this.loading = false;
          this.router.navigate(['/campaigns/' + campaign.id]);
        }),
        catchError((err) => {
          if (!(!!this.currentCampaign)) {
            this.storage.ref(campaignToSave.pic).delete();
          }
          this.loading = false;
          this.toastr.error(err);
          return of(err);
        })
      ).subscribe();
    }
  }

  checkDeletedPlayers(): boolean {
    if (this.originalPlayers === undefined ||
      this.originalPlayers.every((orig) => this.players.some((player) => player.uid === orig.uid))) {
      return false;
    } else {
      return true;
    }
  }

  goBack() {
    this.location.back();
  }

  onFooterClicked(label: string) {
    if (label === 'cancel') {
      this.goBack();
    } else if (label === 'save') {
      this.onSaveClick();
    }
  }

  private scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

}
