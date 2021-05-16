import { Component, Input, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Sheet } from 'src/app/shared/models/sheets/sheets.model';

@Component({
  selector: 'app-rest-modal',
  templateUrl: './rest-modal.component.html',
  styleUrls: ['./rest-modal.component.scss']
})
export class RestModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  @Input() maxHp: number;
  @Input() currentHp: number;
  @Input() sheet: Sheet;
  @Input() sheetId: string;
  @Input() campaignId: string;

  loadingModal = false;

  constructor(private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  onRest() {
    const {
      newDayValues,
      currentHp,
      innateSpells,
      resetSpellsKnown,
      resetCheckedList
    } = SheetService.onRest(this.maxHp, this.currentHp, this.sheet);
    this.loadingModal = true;
    this.sheetService.updateSheetProperty(
      this.campaignId,
      this.sheetId,
      newDayValues,
      [
        'hp',
        'spells',
        'checkLists'
      ],
      [
        {currentHp},
        {innate: innateSpells, known: resetSpellsKnown, prepared: null},
        resetCheckedList
      ]
    ).pipe(
      first(),
      tap(() => {
        this.modal.hide();
        this.loadingModal = false;
      }),
      catchError((err) => {
        this.loadingModal = false;
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }

  public show() {
    this.modal.show();
  }

}
