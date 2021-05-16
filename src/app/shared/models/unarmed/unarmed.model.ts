import { Weapon } from "../weapon/weapon.model";

export class Unarmed {
  total: string;
  damage: string;
  critical: string;
  reach: string;
  type: string;
  notes: string;

  public static toWeapon(unarmed: Unarmed): Weapon {
    return {
      common: {
        name: 'Unarmed',
        toHit: unarmed.total,
        damage: unarmed.damage,
        critical: unarmed.critical,
        reach: unarmed.reach,
        type: unarmed.type,
        notes: unarmed.notes
      }
    };
  }

  public static fromWeapon(unarmed: Weapon, notes: string): Unarmed {
    return {
      total: unarmed.common.toHit,
      damage: unarmed.common.damage,
      critical: unarmed.common.critical,
      reach: unarmed.common.reach,
      type: unarmed.common.type,
      notes
    };
  }

  public static from(objFromREST: any): Unarmed {
    return {
      total: objFromREST?.total,
      damage: objFromREST?.damage,
      critical: objFromREST?.critical,
      reach: objFromREST?.reach,
      type: objFromREST?.type,
      notes: null
    };
  }
}
