export class Weapon {
  common: {
    name: string,
    category?: string,
    critical: string,
    toHit: string,
    hand?: string,
    reach: string,
    range?: string,
    size?: string,
    specialProperties?: string,
    type: string,
    damage: string,
    isLight?: boolean,
    notes: string
  };
  melee?: {
    oneHandPrimary: {
      toHit: string,
      damage: string
    },
    oneHandOffHand: {
      toHit: string,
      damage: string
    },
    twoHanded: {
      toHit: string,
      damage: string
    },
    twoWeaponsPrimaryOffHandHeavy: {
      toHit: string,
      damage: string
    },
    twoWeaponsPrimaryOffHandLight: {
      toHit: string,
      damage: string
    },
    twoWeaponsOffHand: {
      toHit: string,
      damage: string
    },
  };
  ranges?: {
    distance: string,
    toHit: string,
    damage: string,
  }[];

  public static from(objFromREST: any): Weapon[] {
    return 'weapon' in objFromREST ?
    objFromREST?.weapon?.constructor === Object ?
    [{
      common: 'common' in objFromREST?.weapon ?
        {
          name: objFromREST?.weapon?.common?.name?.output,
          category: objFromREST?.weapon?.common?.category,
          critical: objFromREST?.weapon?.common?.critical?.range + '/x' +
            objFromREST?.weapon?.common?.critical?.multiplier,
          toHit: objFromREST?.weapon?.common?.to_hit?.total_hit,
          hand: objFromREST?.weapon?.common?.hand,
          reach: objFromREST?.weapon?.common?.reach + objFromREST?.weapon?.common?.reachunit,
          range: objFromREST?.weapon?.common?.range,
          size: objFromREST?.weapon?.common?.size,
          specialProperties: typeof objFromREST?.weapon?.common?.special_properties === 'string' ?
            objFromREST?.weapon?.common?.special_properties :
            '',
          type: objFromREST?.weapon?.common?.type,
          damage: objFromREST?.weapon?.common?.damage,
          isLight: objFromREST?.weapon?.common?.islight === 'TRUE',
          notes: null
        } :
        null,
      melee: 'melee' in objFromREST?.weapon ?
        {
          oneHandPrimary: {
            toHit: objFromREST?.weapon?.melee?.w1_h1_p?.to_hit,
            damage: objFromREST?.weapon?.melee?.w1_h1_p?.damage
          },
          oneHandOffHand: {
            toHit: objFromREST?.weapon?.melee?.w1_h1_o?.to_hit,
            damage: objFromREST?.weapon?.melee?.w1_h1_o?.damage
          },
          twoHanded: {
            toHit: objFromREST?.weapon?.melee?.w1_h2?.to_hit,
            damage: objFromREST?.weapon?.melee?.w1_h2?.damage
          },
          twoWeaponsPrimaryOffHandHeavy: {
            toHit: objFromREST?.weapon?.melee?.w2_p_oh?.to_hit,
            damage: objFromREST?.weapon?.melee?.w2_p_oh?.damage
          },
          twoWeaponsPrimaryOffHandLight: {
            toHit: objFromREST?.weapon?.melee?.w2_p_ol?.to_hit,
            damage: objFromREST?.weapon?.melee?.w2_p_ol?.damage
          },
          twoWeaponsOffHand: {
            toHit: objFromREST?.weapon?.melee?.w2_o?.to_hit,
            damage: objFromREST?.weapon?.melee?.w2_o?.damage
          },
        } : null,
      ranges: 'ranges' in objFromREST?.weapon ?
        objFromREST?.weapon?.ranges?.range?.map((singleRange) => ({
          distance: singleRange?.distance,
          toHit: singleRange?.to_hit,
          damage: singleRange?.damage,
        })) :
        null,
      }] :
      objFromREST?.weapon?.map((singleWeapon) => ({
        common: 'common' in singleWeapon ?
          {
            name: singleWeapon?.common?.name?.output,
            category: singleWeapon?.common?.category,
            critical: singleWeapon?.common?.critical?.range + '/x' +
            singleWeapon?.common?.critical?.multiplier,
            toHit: singleWeapon?.common?.to_hit?.total_hit,
            hand: singleWeapon?.common?.hand,
            reach: singleWeapon?.common?.reach + singleWeapon?.common?.reachunit,
            range: singleWeapon?.common?.range,
            size: singleWeapon?.common?.size,
            specialProperties: typeof singleWeapon?.common?.special_properties === 'string' ?
            singleWeapon?.common?.special_properties :
              '',
            type: singleWeapon?.common?.type,
            damage: singleWeapon?.common?.damage,
            isLight: singleWeapon?.common?.islight === 'TRUE',
            notes: null
          } :
          null,
        melee: 'melee' in singleWeapon ?
          {
            oneHandPrimary: {
              toHit: singleWeapon?.melee?.w1_h1_p?.to_hit,
              damage: singleWeapon?.melee?.w1_h1_p?.damage
            },
            oneHandOffHand: {
              toHit: singleWeapon?.melee?.w1_h1_o?.to_hit,
              damage: singleWeapon?.melee?.w1_h1_o?.damage
            },
            twoHanded: {
              toHit: singleWeapon?.melee?.w1_h2?.to_hit,
              damage: singleWeapon?.melee?.w1_h2?.damage
            },
            twoWeaponsPrimaryOffHandHeavy: {
              toHit: singleWeapon?.melee?.w2_p_oh?.to_hit,
              damage: singleWeapon?.melee?.w2_p_oh?.damage
            },
            twoWeaponsPrimaryOffHandLight: {
              toHit: singleWeapon?.melee?.w2_p_ol?.to_hit,
              damage: singleWeapon?.melee?.w2_p_ol?.damage
            },
            twoWeaponsOffHand: {
              toHit: singleWeapon?.melee?.w2_o?.to_hit,
              damage: singleWeapon?.melee?.w2_o?.damage
            },
          } : null,
        ranges: 'ranges' in singleWeapon ?
          singleWeapon?.ranges?.range?.map((singleRange) => ({
            distance: singleRange?.distance,
            toHit: singleRange?.to_hit,
            damage: singleRange?.damage,
          })) :
          null,
      })) :
    null;
  }
}

export const wieldStyles: {[wieldStyle: string]: string} = {
  oneHandPrimary: 'One hand (P)',
  oneHandOffHand: 'One hand (OH)',
  twoHanded: 'Two handed',
  twoWeaponsPrimaryOffHandHeavy: 'Two weapons (P-OHH)',
  twoWeaponsPrimaryOffHandLight: 'Two weapons (P-OHL)',
  twoWeaponsOffHand: 'Two weapons (OH)',
};
