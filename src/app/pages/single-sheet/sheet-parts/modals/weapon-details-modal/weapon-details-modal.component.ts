import { Unarmed } from 'src/app/shared/models/unarmed/unarmed.model';
import { Component, Input, ViewChild } from '@angular/core';
import { DiceRollService } from 'src/app/services/dice-roll.service';
import { SheetService } from 'src/app/services/sheet.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Weapon, wieldStyles } from 'src/app/shared/models/weapon/weapon.model';
import { catchError, first, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-weapon-details-modal',
  templateUrl: './weapon-details-modal.component.html',
  styleUrls: ['./weapon-details-modal.component.scss']
})
export class WeaponDetailsModalComponent {
  @ViewChild('modal', {static: true}) modal: ModalComponent;

  @Input() campaign: string;
  @Input() sheet: string;
  @Input() bab = 0;
  @Input() set weapon(value: Weapon) {
    if (!!value) {
      this.weaponValue = {...value};
      this.isUnarmed = value.common.name === 'Unarmed';
      this.notes = value.common.notes;
      this.wieldStyles = [];
      if (!!value.melee) {
        this.wieldStyles = Object.keys(value.melee);
      }
    }
  }
  @Input() list: Weapon[] = [];

  weaponValue: Weapon;
  isUnarmed = false;
  notes: string;
  wieldStyles: string[] = [];
  wieldsLegend: {[wieldStyle: string]: string} = wieldStyles;

  loadingModal = false;

  constructor(private sheetService: SheetService,
              private toastr: CustomToastrService,
              public rollDice: DiceRollService) { }

  reset() {
    this.notes = undefined;
  }

  rollToHit(toHitBonus: string) {
    const numberValue = UtilsService.getDecreasingToHit(
      parseInt(toHitBonus, 10),
      this.bab
    );
    this.rollDice.rollD20(1, numberValue, this.weaponValue.common.name);
  }

  submitNotes() {
    this.loadingModal = true;
    let objForFirestore: any;
    let pathForRedux: any;
    let newObj: any;
    if (this.isUnarmed) {
      const newUnarmed = Unarmed.fromWeapon(this.weaponValue, this.notes);
      objForFirestore = {combat: {weapons: {unarmed: newUnarmed}}};
      pathForRedux = ['combat.weapons.unarmed'];
      newObj = [newUnarmed];
    } else {
      const newWeapons = this.list.map((singleWeapon) => {
        if (singleWeapon.common.name === this.weaponValue.common.name) {
          return {
            ...singleWeapon,
            common: {
              ...singleWeapon.common,
              notes: this.notes
            }
          };
        } else {
          return singleWeapon;
        }
      });
      objForFirestore = {combat: {weapons: {weapon: newWeapons}}};
      pathForRedux = ['combat.weapons.weapon'];
      newObj = [newWeapons];
    }
    this.sheetService.updateSheetProperty(
      this.campaign,
      this.sheet,
      objForFirestore,
      pathForRedux,
      newObj
    ).pipe(
      first(),
      tap(() => {
        this.loadingModal = false;
        this.modal.hide();
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
