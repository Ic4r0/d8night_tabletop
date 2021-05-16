import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppState } from 'src/app/store/store.model';
import { Store } from '@ngrx/store';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { getCampaignCurrent, getUserCurrent } from 'src/app/store/store.reducer';
import { Campaign } from 'src/app/store/campaigns/campaigns.model';
import { User } from 'src/app/store/users/users.model';
import { BreadcrumbItems } from 'src/app/shared/models/breadcrumb-items/breadcrumb-items.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { CampaignsApiService } from 'src/app/services/campaigns-api.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { catchError, first, mergeMap, tap } from 'rxjs/operators';
import { addSheet, deleteCampaign, deleteSheet, updateCampaign, updateSheetAuth } from 'src/app/store/campaigns/campaigns.actions';
import { Sheet } from 'src/app/shared/models/sheets/sheets.model';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { v4 as uuidv4 } from 'uuid';

declare var UIkit: any;

@Component({
  selector: 'app-single-campaign',
  templateUrl: './single-campaign.component.html',
  styleUrls: ['./single-campaign.component.scss']
})
export class SingleCampaignComponent implements OnInit, OnDestroy {
  @ViewChild('leaveCampaignModal', {static: true}) leaveCampaignModal: ModalComponent;
  @ViewChild('addNewSheet', {static: true}) addNewSheet: ModalComponent;
  @ViewChild('shareSheetWithOthers', {static: true}) shareSheetWithOthers: ModalComponent;
  @ViewChild('deleteSheetModal', {static: true}) deleteSheetModal: ModalComponent;
  @ViewChild('sheetUpload', {static: true}) sheetUpload: ElementRef;

  subs: Array<Subscription> = [];
  currentCampaign: Campaign = null;
  campaignImageUrl: Observable<string>;

  selectedPlayer: User;
  sheetsListByPlayer: {
    [userId: string]: Array<{
      sheetId: string,
      sharedWithMe: boolean,
      owned: boolean,
      info: {
        name: string,
        classes: Array<{
          name: string,
          level: number
        }>
      }
    }>
  } = {};

  user: User;
  isMaster = false;

  page = 1;

  breadcrumb: Array<BreadcrumbItems> = [
    { path: '/home', name: 'Home' },
    { path: '/campaigns', name: 'Campaigns' },
  ];

  footerButtons: { icon: string, text: string, label: string }[] = [
    { icon: 'upload', text: 'New sheet', label: 'new' },
    { icon: 'trash', text: 'Leave campaign', label: 'leave' }
  ];

  loading = false;
  loadingModal = false;

  loadedXmlSheet: File;
  loadedSheet: Sheet;

  selectedSheet: {
    sheetId: string,
    player: User,
    sharedWith: Array<User>,
    info: {
      name: string,
      classes: Array<{
        name: string,
        level: number
      }>
    }
  } = null;
  playersAuthForSelectedSheet: {
    user: User,
    sharedWith: boolean,
  }[] = [];
  classesList = [
    'Ranger',
    'Warpriest',
    'Bard',
    'Hunter',
    'Occultist',
    'Cavalier',
    'Barbarian',
    'Skald',
    'Shifter',
    'Vigilante',
    'Antipaladin',
    'Paladin',
    'Monk',
    'Brawler',
    'Inquisitor',
    'Cleric',
    'Rogue',
    'Druid',
    'Magus',
    'Oracle',
    'Bloodrager',
    'Kineticist',
    'Medium',
    'Gunslinger',
    'Ninja',
    'Sorcerer',
    'Alchemist',
    'Psychic',
    'Vampire Hunter',
    'Slayer',
    'Samurai',
    'Investigator',
    'Spiritualist',
    'Wizard',
    'Swashbuckler',
    'Fighter',
    'Mesmerist',
    'Shaman',
    'Summoner',
    'Witch',
    'Arcanist',
  ];

  constructor(private titleService: Title,
              private store: Store<AppState>,
              private storage: AngularFireStorage,
              private apiCampaign: CampaignsApiService,
              private toastr: CustomToastrService,
              private router: Router,
              private xml2jsonserv: NgxXml2jsonService) {
    this.titleService.setTitle('Propria campagna - d8 Night');
  }

  ngOnInit(): void {
    this.subs.push(
      this.store.select(getUserCurrent).subscribe((user) => {
        this.user = {...user};
        this.setMaster();
        this.initializeSheetsListByPlayer();
      }),
      this.store.select(getCampaignCurrent).subscribe((currCampaign) => {
        this.currentCampaign = {...currCampaign};
        this.titleService.setTitle(this.currentCampaign.name + ' - d8 Night');
        this.campaignImageUrl = this.storage.ref(this.currentCampaign.pic).getDownloadURL();
        // create an object where keys are the player uid and there is an array of sheets for each player
        this.setMaster();
        this.initializeSheetsListByPlayer();
        this.setBreadcrumb();
      })
    );

    UIkit.upload(this.sheetUpload.nativeElement, {
      url: '',
      multiple: false,
      method: () => false
    });
  }

  setBreadcrumb() {
    this.breadcrumb = [
      { path: '/home', name: 'Home' },
      { path: '/campaigns', name: 'Campaigns' },
      { path: '', name: this.currentCampaign?.name }
    ];
  }

  setMaster() {
    if (!!this.user && !!this.currentCampaign && !!this.currentCampaign?.master) {
      this.isMaster = this.user.uid === this.currentCampaign.master.uid;
      if (this.currentCampaign.master.uid !== this.user.uid) {
        this.selectedPlayer = {...this.user};
      } else {
        this.selectedPlayer = {...this.currentCampaign.players[0]};
      }
      if (this.isMaster) {
        this.footerButtons = [
          { icon: 'upload', text: 'New sheet', label: 'new' },
          { icon: 'cog', text: 'Settings', label: 'manage' },
          { icon: 'trash', text: 'Leave campaign', label: 'leave' }
        ];
      }
    }
  }

  initializeSheetsListByPlayer() {
    if (!!this.user && !!this.currentCampaign && !!this.currentCampaign?.players) {
      this.sheetsListByPlayer = {};
      this.currentCampaign.players.forEach(({uid}) => {
        this.sheetsListByPlayer[uid] = [];
      });
      if (!!this.currentCampaign?.sheetSharing && Object.keys(this.currentCampaign.sheetSharing).length > 0) {
        const sheetsIdx = Object.keys(this.currentCampaign.sheetSharing);
        sheetsIdx.forEach((idx) => {
          const playerUID = this.currentCampaign.sheetSharing[idx].player.uid;
          const sharedWithMe = this.isMaster ||
            this.user.uid === playerUID ||
            this.currentCampaign.sheetSharing[idx].sharedWith.some(({uid}) => uid === this.user.uid);
          this.sheetsListByPlayer[playerUID].push({
            sheetId: idx,
            sharedWithMe,
            owned: this.user.uid === playerUID,
            info: {
              ...this.currentCampaign.sheetSharing[idx].info
            }
          });
        });
        Object.keys(this.sheetsListByPlayer).forEach((player) => {
          // Order sheets by name of the PCs
          this.sheetsListByPlayer[player].sort((a, b) => {
            if (a.info.name < b.info.name) {
              return -1;
            }
            if (a.info.name > b.info.name) {
              return 1;
            }
            return 0;
          });
          // Order sheets by level of PCs
          this.sheetsListByPlayer[player].sort((a, b) => {
            const levelA = a.info.classes.map(({level}) => level).reduce((x, y) => x + y, 0);
            const levelB = b.info.classes.map(({level}) => level).reduce((x, y) => x + y, 0);
            if (levelA < levelB) {
              return -1;
            }
            if (levelA > levelB) {
              return 1;
            }
            return 0;
          });
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  changeSelectedPlayer(user: User) {
    this.selectedPlayer = {...user};
    this.page = 1;
  }

  assignIcon(pcClass: string): string {
    let iconPath = pcClass.toLowerCase();
    if (!this.classesList.includes(pcClass)) {
      iconPath = 'na';
    }
    return 'classes/' + iconPath;
  }

  addSheet() {
    this.addNewSheet.show();
  }

  onLeaveCampaign() {
    this.leaveCampaignModal.show();
  }

  leaveCampaign() {
    this.loadingModal = true;
    if (this.isMaster) {
      this.apiCampaign.removeCampaign(this.currentCampaign).pipe(
        first(),
        tap(() => {
          this.loadingModal = false;
          this.leaveCampaignModal.hide();
          this.store.dispatch(deleteCampaign({ campaignToDelete: this.currentCampaign.id }));
          this.router.navigate(['/campaigns']);
        }),
        catchError((err) => {
          this.loadingModal = false;
          this.toastr.error(err);
          return of(err);
        })
      ).subscribe();
    } else {
      const userIdx = this.user.uid;
      let sheetsIdx: string[] = [];
      const newSheetSharing = {};
      Object.keys(this.currentCampaign.sheetSharing).forEach((key) => {
        const player = this.currentCampaign.sheetSharing[key].player;
        const sharedWith = this.currentCampaign.sheetSharing[key].sharedWith;
        if (userIdx ===  player.uid) {
          sheetsIdx = [
            ...sheetsIdx,
            key
          ];
        } else {
          newSheetSharing[key] = {
            ...this.currentCampaign.sheetSharing[key],
            sharedWith: sharedWith.filter(({uid}) => userIdx !== uid)
          };
        }
      });
      const updatedCampaign: Campaign = {
        ...this.currentCampaign,
        sheetSharing: { ...newSheetSharing }
      };
      this.apiCampaign.removePlayersSheets(this.currentCampaign.id, sheetsIdx).pipe(
        first(),
        mergeMap(() => this.apiCampaign.updateCampaign(updatedCampaign).pipe(first())),
        tap(() => {
          if (Object.keys(this.currentCampaign.sheets).length > 0) {
            sheetsIdx.forEach((idx) => {
              if (idx in this.currentCampaign.sheets) {
                delete this.currentCampaign.sheets[idx];
              }
            });
          }
          const campaign: Campaign = {
            ...updatedCampaign,
            sheets: this.currentCampaign.sheets
          };
          this.loadingModal = false;
          this.leaveCampaignModal.hide();
          this.store.dispatch(updateCampaign({ campaign }));
          this.router.navigate(['/campaigns']);
        }),
        catchError((err) => {
          this.loadingModal = false;
          this.toastr.error(err);
          return of(err);
        })
      ).subscribe();
    }
  }

  onFooterClicked(label: string) {
    if (label === 'new') {
      this.addSheet();
    } else if (label === 'manage' && 'id' in this.currentCampaign) {
      this.router.navigate(['/campaigns/' + this.currentCampaign.id + '/edit']);
    } else if (label === 'leave') {
      this.onLeaveCampaign();
    }
  }

  onFileUpload(fileArray: any) {
    this.loadingModal = true;
    if (fileArray && fileArray.length > 0) {
      const file = fileArray[0][0];
      if (file.type.toLowerCase().includes('text/xml')) {
        this.xmlToSheet(file);
        this.loadingModal = false;
      } else {
        this.loadingModal = false;
        this.toastr.warning(
          'The uploaded file is not an xml',
          'Warning'
        );
      }
    }
  }

  xmlToSheet(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const readxml = reader.result.toString();
      const parser = new DOMParser();
      const xmlFromInput = parser.parseFromString(readxml, 'text/xml');
      const jsonFromInput = this.xml2jsonserv.xmlToJson(xmlFromInput);
      const uploadedSheet = Sheet.objectFromJson(jsonFromInput);
      const displaySkillsLength = Math.min(
        16,
        Object.keys(uploadedSheet.skills.skill).length
      );
      this.loadedSheet = {
        ...uploadedSheet,
        skills: {
          ...uploadedSheet.skills,
          display: Object.keys(uploadedSheet.skills.skill).slice(
            0,
            displaySkillsLength
          )
        }
      };
    };
    reader.readAsText(file);
  }

  formatLoadedClasses(classes: any): string {
    const classesNames = classes.map((singleClass) => singleClass.name);
    return classesNames.join(', ');
  }

  uploadSheet() {
    this.loadingModal = true;
    const sheetId = uuidv4();
    const sheetSharingInfo = {
      player: this.user,
      sharedWith: [],
      info: {
        name: this.loadedSheet.name,
        classes: this.loadedSheet.classes.map((singleClass) => ({
          name: singleClass.name,
          level: singleClass.level
        })),
        maxHp: this.loadedSheet.hp.maxHp
      }
    };
    this.apiCampaign.addSheet(
      this.currentCampaign,
      {
        player: this.user,
        sharedWith: [],
        info: {
          name: this.loadedSheet.name,
          classes: this.loadedSheet.classes.map((singleClass) => ({
            name: singleClass.name,
            level: singleClass.level
          })),
          maxHp: this.loadedSheet.hp.maxHp
        }
      },
      sheetId,
      this.loadedSheet
    ).pipe(
      first(),
      tap(() => {
        this.store.dispatch(addSheet({
          sheet: this.loadedSheet,
          id: sheetId,
          sheetSharingInfo
        }));
        this.addNewSheet.hide();
        this.loadingModal = false;
      }),
      catchError((err) => {
        this.toastr.error(err);
        this.loadingModal = false;
        return of(err);
      })
    ).subscribe();
  }

  resetUploadModal() {
    this.loadedSheet = undefined;
  }

  openSheet(sheetId: string) {
    const campaignUrl = `/campaigns/${this.currentCampaign.id}/sheets/${sheetId}`;
    this.router.navigate([campaignUrl]);
  }

  onDeleteSheet(sheetId: string) {
    this.selectedSheet = {
      sheetId,
      player: {...this.currentCampaign.sheetSharing[sheetId].player},
      sharedWith: [...this.currentCampaign.sheetSharing[sheetId].sharedWith],
      info: {...this.currentCampaign.sheetSharing[sheetId].info}
    };
    this.deleteSheetModal.show();
  }

  deleteSheet() {
    this.loadingModal = true;
    this.apiCampaign.deleteSheet(this.currentCampaign, this.selectedSheet.sheetId).pipe(
      first(),
      tap(() => {
        this.store.dispatch(deleteSheet({ id: this.selectedSheet.sheetId }));
        this.deleteSheetModal.hide();
        this.loadingModal = false;
      }),
      catchError((err) => {
        this.loadingModal = false;
        return of(err);
      })
    ).subscribe();
  }

  shareSheet(sheetId: string) {
    this.selectedSheet = {
      sheetId,
      player: {...this.currentCampaign.sheetSharing[sheetId].player},
      sharedWith: [...this.currentCampaign.sheetSharing[sheetId].sharedWith],
      info: {...this.currentCampaign.sheetSharing[sheetId].info}
    };
    this.playersAuthForSelectedSheet = this.currentCampaign.players
      .filter(({uid}) => this.user.uid !== uid)
      .map((singleUser) => ({
        user: singleUser,
        sharedWith: this.selectedSheet.sharedWith.some(({uid}) => uid === singleUser.uid)
      }));
    this.shareSheetWithOthers.show();
  }

  changeSheetAuth(userUid: string) {
    this.playersAuthForSelectedSheet = this.playersAuthForSelectedSheet
      .map(({user, sharedWith}) => ({
        user,
        sharedWith: user.uid === userUid ? !sharedWith : sharedWith
      }));
  }

  resetSelectedSheet() {
    this.selectedSheet = null;
    this.playersAuthForSelectedSheet = [];
  }

  updateShareAuth() {
    this.loadingModal = true;
    const authToUpdate: User[] = this.playersAuthForSelectedSheet
      .filter(({sharedWith}) => sharedWith)
      .map(({user}) => user);
    const sheetSharingInfo = {
      ...this.currentCampaign.sheetSharing[this.selectedSheet.sheetId],
      sharedWith: authToUpdate
    };
    this.apiCampaign.updateSheetAuth(
      this.currentCampaign,
      sheetSharingInfo,
      this.selectedSheet.sheetId
    ).pipe(
      first(),
      tap(() => {
        this.store.dispatch(updateSheetAuth({
          id: this.selectedSheet.sheetId,
          sheetSharingInfo
        }));
        this.shareSheetWithOthers.hide();
        this.loadingModal = false;
      }),
      catchError((err) => {
        this.loadingModal = false;
        return of(err);
      })
    ).subscribe();
  }

  getLevelsList(classesList) {
    return classesList.map(({level}) => level).join(' / ');
  }

}
