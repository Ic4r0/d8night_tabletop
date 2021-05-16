import { Component, Input, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { EquipmentItem } from 'src/app/shared/models/equipment/equipment.model';

export enum EditEquip {
  NEW = 1,
  EDIT
}

@Component({
  selector: 'app-edit-equip-modal',
  templateUrl: './edit-equip-modal.component.html',
  styleUrls: ['./edit-equip-modal.component.scss']
})
export class EditEquipModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  @Input() campaign: string;
  @Input() sheet: string;
  @Input() set mode(value: EditEquip) {
    if (!!value) {
      this.operatingMode = value;
      switch (value) {
        case EditEquip.NEW:
          this.name.enable();
          this.reset();
          break;
        case EditEquip.EDIT:
          this.name.disable();
          break;
      }
    }
  }
  @Input() set item(value: EquipmentItem) {
    if (!!value) {
      this.originalItem = {...value};
      this.equip.patchValue({
        ...this.originalItem,
        contents: []
      });
      this.contents.clear();
      if (!!value.contents) {
        value.contents.forEach((content) => {
          this.addContent(content);
        });
      }
    }
  }
  @Input() equipment: EquipmentItem[] = [];

  originalItem: EquipmentItem;
  operatingMode: EditEquip = EditEquip.NEW;
  editEquipEnum: typeof EditEquip = EditEquip;

  loadingModal = false;

  equip = this.form.group({
    name: this.form.control('', Validators.required),
    charges: this.form.control(''),
    chargesUsed: this.form.control(''),
    chargesMax: this.form.control(''),
    contents: this.form.array([]),
    cost: this.form.control(''),
    quantity: this.form.control('', Validators.required),
    size: this.form.control(''),
    specialProperties: this.form.control(''),
  });

  get name() {
    return this.equip.get('name');
  }
  get charges() {
    return this.equip.get('charges');
  }
  get chargesUsed() {
    return this.equip.get('chargesUsed');
  }
  get chargesMax() {
    return this.equip.get('chargesMax');
  }
  get contents() {
    return this.equip.get('contents') as FormArray;
  }
  get cost() {
    return this.equip.get('cost');
  }
  get quantity() {
    return this.equip.get('quantity');
  }
  get size() {
    return this.equip.get('size');
  }
  get specialProperties() {
    return this.equip.get('specialProperties');
  }

  constructor(private sheetService: SheetService,
              private toastr: CustomToastrService,
              private form: FormBuilder) { }

  resetModal() {
    this.equip = this.form.group({
      name: this.form.control('', Validators.required),
      charges: this.form.control(''),
      chargesUsed: this.form.control(''),
      chargesMax: this.form.control(''),
      contents: this.form.array([]),
      cost: this.form.control(''),
      quantity: this.form.control('', Validators.required),
      size: this.form.control(''),
      specialProperties: this.form.control(''),
    });
  }

  reset() {
    this.originalItem = undefined;
    this.resetModal();
  }

  submit() {
    this.equip.markAllAsTouched();
    if (this.equip.valid) {
      const contents = this.contents.length > 0 ?
        this.contents.value.map(({item}) => item) : null;
      const newItem: EquipmentItem = {
        ...this.equip.getRawValue(),
        contents
      };
      let newEquipment: EquipmentItem[];
      if (this.operatingMode === EditEquip.NEW) {
        newEquipment = [...this.equipment, newItem];
      } else {
        newEquipment = this.equipment.map((oldItem) => {
          if (oldItem.name === newItem.name) {
            return newItem;
          } else {
            return oldItem;
          }
        });
      }
      this.loadingModal = true;
      this.sheetService.updateSheetProperty(
        this.campaign,
        this.sheet,
        {gear: {items: newEquipment}},
        ['gear.items'],
        [newEquipment],
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
  }

  addContent(content: string = '1 New item') {
    this.contents.push(this.newContent(content));
  }

  private newContent(content: string = '1 New item'): FormGroup {
    return new FormGroup({
      'item': new FormControl(content)
    })
  }

  removeContent(idx: number) {
    if (this.contents.length > 1) {
      this.contents.removeAt(idx);
    } else {
      this.contents.clear();
    }
  }

  checkDifferences() {
    if (this.operatingMode === EditEquip.NEW) {
      return this.name.valid && this.quantity.valid;
    } else if (this.operatingMode === EditEquip.EDIT && !!this.originalItem) {
      for (const value in this.equip.value) {
        if (this.equip?.value.hasOwnProperty(value)) {
          if (['name', 'size', 'specialProperties'].includes(value) && this.originalItem[value] !== this.equip.value[value]) {
            return true;
          } else if (['charges', 'chargesUsed', 'chargesMax', 'cost', 'quantity'].includes(value)) {
            const tempValue = isNaN(parseInt(this.equip.value[value], 10)) ?
              null : this.equip.value[value];
            if (tempValue !== this.originalItem[value]) {
              return true;
            }
          } else if (value === 'contents' &&
                    !UtilsService.equals(this.originalItem.contents, this.contents.value.map(({item}) => item))) {
            return true;
          }
        }
      }
      return false;
    }
  }

  public show() {
    this.modal.show();
  }
}
