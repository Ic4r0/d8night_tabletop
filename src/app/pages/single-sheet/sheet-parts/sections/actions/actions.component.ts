import { DiceRollService } from './../../../../../services/dice-roll.service';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SheetService } from 'src/app/services/sheet.service';
import { CustomToastrService } from 'src/app/shared/custom-toastr/custom-toastr.service';
import { FeaturesObj } from 'src/app/shared/models/feats-and-traits/features-obj.model';
import { Unarmed } from 'src/app/shared/models/unarmed/unarmed.model';
import { Weapon } from 'src/app/shared/models/weapon/weapon.model';
import { UtilsService } from 'src/app/services/utils.service';
import { WeaponDetailsModalComponent } from '../../modals/weapon-details-modal/weapon-details-modal.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  @ViewChild('weaponDetailModal', {static: true}) weaponDetailModal: WeaponDetailsModalComponent;

  @Input() mobile = false;
  @Input() tablet = false;
  @Input() set bab(value: number) {
    if (!!value || value === 0) {
      this.babValue = value;
      this.setUnarmedToHit();
    }
  }
  @Input() set unarmed(value: Unarmed) {
    if (!!value) {
      this.unarmedValue = {...value};
      this.setUnarmedToHit();
    }
  }
  @Input() set weapons(value: Weapon[]) {
    if (!!value) {
      this.weaponsValue = [...value];
      this.setWeaponsToHit();
    }
  }
  @Input() specialAttacks: FeaturesObj[];
  @Input() campaign: string;
  @Input() sheet: string;

  babValue: number;
  unarmedValue: Unarmed;
  unarmedToHit: {numberValue: number[], stringValue: string};
  weaponsValue: Weapon[] = [];
  weaponsToHit: {[weaponName: string]: {numberValue: number[], stringValue: string}};

  selectedWeapon: Weapon;

  loading = false;

  constructor(public rollService: DiceRollService) { }

  private setUnarmedToHit() {
    if ((!!this.babValue || this.babValue === 0) && !!this.unarmedValue) {
      const numberValue = UtilsService.getDecreasingToHit(
        parseInt(this.unarmedValue.total, 10),
        this.babValue
      );
      this.unarmedToHit = {
        numberValue,
        stringValue: UtilsService.getNumberSign(numberValue[0])
      };
    }
  }

  private setWeaponsToHit() {
    if ((!!this.babValue || this.babValue === 0) && !!this.weaponsValue) {
      this.weaponsToHit = {};
      this.weaponsValue.forEach((singleWeapon) => {
        const numberValue = UtilsService.getDecreasingToHit(
          parseInt(singleWeapon.common.toHit , 10),
          this.babValue
        );
        this.weaponsToHit[singleWeapon.common.name] = {
          numberValue,
          stringValue: UtilsService.getNumberSign(numberValue[0])
        };
      });
    }
  }

  openWeapon(isUnarmed: boolean = false, weapon?: Weapon) {
    if (isUnarmed) {
      this.selectedWeapon = Unarmed.toWeapon(this.unarmedValue);
    } else {
      this.selectedWeapon = weapon;
    }
    this.weaponDetailModal.show();
  }
}
