import { Component, EventEmitter, Input, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { FeaturesObj } from 'src/app/shared/models/feats-and-traits/features-obj.model';

@Component({
  selector: 'app-feats-traits',
  templateUrl: './feats-traits.component.html',
  styleUrls: ['./feats-traits.component.scss']
})
export class FeatsTraitsComponent {
  @Input() mobile = false;
  @Input() tablet = false;

  @Input() checkLists: FeaturesObj[] = [];
  @Input() archetypes: FeaturesObj[] = [];
  @Input() specialQualities: FeaturesObj[] = [];
  @Input() set feats(value: FeaturesObj[]) {
    if (!!value && value.length > 0) {
      this.featsList = value.filter(({description}) => !!description);
    }
  }
  @Input() traits: FeaturesObj[] = [];
  @Input() campaign: string;
  @Input() sheet: string;
  @Output() checked = new EventEmitter<FeaturesObj[]>();

  loading = false;

  featsList: FeaturesObj[] = [];

  constructor(private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  onCheckboxChange(singleCheckList: FeaturesObj, checked: number) {
    const newChecklist = this.checkLists.map((elem) => {
      if (singleCheckList.name === elem.name) {
        return {
          ...singleCheckList,
          checked
        };
      }
      return {
        ...elem
      };
    });
    this.loading = true;
    this.sheetService.updateSheetProperty(
      this.campaign,
      this.sheet,
      {checkLists: newChecklist},
      ['checkLists'],
      [newChecklist]
    ).pipe(
      first(),
      tap(() => {
        this.loading = false;
      }),
      catchError((err) => {
        this.loading = false;
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }
}
