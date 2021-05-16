import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Equipment, EquipmentItem } from 'src/app/shared/models/equipment/equipment.model';
import { EditEquip, EditEquipModalComponent } from '../../modals/edit-equip-modal/edit-equip-modal.component';
import { MoneyModalComponent } from '../../modals/money-modal/money-modal.component';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent {
  @ViewChild('removeEquipModal', {static: true}) removeEquipModal: ModalComponent;
  @ViewChild('editEquipModal', {static: true}) editEquipModal: EditEquipModalComponent;
  @ViewChild('moneyModal', {static: true}) moneyModal: MoneyModalComponent;

  equipmentValue: Equipment;
  currentLoad = 0;

  selectedEquipment: EquipmentItem;
  operatingMode: EditEquip;

  loadingModal = false;

  @Input() mobile = false;
  @Input() tablet = false;
  @Input() campaign: string;
  @Input() sheet: string;
  @Input() set equipment(value: Equipment) {
    if (!!value) {
      this.equipmentValue = value;
      this.currentLoad = parseFloat(value.total.weight.replace(',', '.'));
    }
  }
  @Output() checked = new EventEmitter<any[]>();

  constructor(private sheetService: SheetService,
              private toastr: CustomToastrService) { }

  onSelectEquipment(equipmentItem: EquipmentItem, editOrDelete: string) {
    this.selectedEquipment = {...equipmentItem};
    if (editOrDelete === 'edit') {
      this.operatingMode = EditEquip.EDIT;
      this.editEquipModal.show();
    } else if (editOrDelete === 'delete') {
      this.removeEquipModal.show();
    }
  }

  newEquipment() {
    this.operatingMode = EditEquip.NEW;
    this.editEquipModal.show();
  }

  deleteEquipment() {
    const newItems = [...this.equipmentValue.items];
    const equipIdx = this.equipmentValue.items.findIndex(({name}) => name === this.selectedEquipment.name);
    newItems.splice(equipIdx, 1);
    this.loadingModal = true;
    this.sheetService.updateSheetProperty(
      this.campaign,
      this.sheet,
      {gear: {items: newItems}},
      ['gear.items'],
      [newItems]
    ).pipe(
      first(),
      tap(() => {
        this.selectedEquipment = undefined;
        this.loadingModal = false;
        this.removeEquipModal.hide();
      }),
      catchError((err) => {
        this.loadingModal = false;
        this.toastr.error(err);
        return of(err);
      })
    ).subscribe();
  }
}
