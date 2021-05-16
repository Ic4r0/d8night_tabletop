export class CombatModifiers {
  conditionalModifiers?: string[];
  melee: {
    babBonus: number;
    modStat: number;
    modSize: number;
    modMisc: number;
    modTemp: number;
  };
  ranged: {
    babBonus: number;
    modStat: number;
    modSize: number;
    modMisc: number;
    modTemp: number;
  };
  cmb: {
    babBonus: number;
    modStat: number;
    modSize: number;
    modMisc: number;
    modTemp: number;
  };
  cmd: {
    total: number;
    modTemp: number;
  };

  public static from(objFromREST: any): CombatModifiers {
    return {
      conditionalModifiers: typeof objFromREST?.conditional_modifiers === 'string' ?
        null :
        objFromREST?.conditional_modifiers?.combatbonus?.constructor === Object ?
        [
          objFromREST?.conditional_modifiers?.combatbonus?.description
        ] :
        objFromREST?.conditional_modifiers?.combatbonus?.map((singleBonus) =>
          singleBonus?.description
        ),
      melee: {
        babBonus: isNaN(objFromREST?.melee?.bab) ? 0 : parseInt(objFromREST?.melee?.bab, 10),
        modStat: isNaN(objFromREST?.melee?.stat_mod) ? 0 : parseInt(objFromREST?.melee?.stat_mod, 10),
        modSize: isNaN(objFromREST?.melee?.size_mod) ? 0 : parseInt(objFromREST?.melee?.size_mod, 10),
        modMisc: isNaN(objFromREST?.melee?.misc_mod) ? 0 : parseInt(objFromREST?.melee?.misc_mod, 10),
        modTemp: isNaN(objFromREST?.melee?.temp_mod) ? 0 : parseInt(objFromREST?.melee?.temp_mod, 10)
      },
      ranged: {
        babBonus: isNaN(objFromREST?.ranged?.bab) ? 0 : parseInt(objFromREST?.ranged?.bab, 10),
        modStat: isNaN(objFromREST?.ranged?.stat_mod) ? 0 : parseInt(objFromREST?.ranged?.stat_mod, 10),
        modSize: isNaN(objFromREST?.ranged?.size_mod) ? 0 : parseInt(objFromREST?.ranged?.size_mod, 10),
        modMisc: isNaN(objFromREST?.ranged?.misc_mod) ? 0 : parseInt(objFromREST?.ranged?.misc_mod, 10),
        modTemp: isNaN(objFromREST?.ranged?.temp_mod) ? 0 : parseInt(objFromREST?.ranged?.temp_mod, 10)
      },
      cmb: {
        babBonus: isNaN(objFromREST?.cmb?.bab) ? 0 : parseInt(objFromREST?.cmb?.bab, 10),
        modStat: isNaN(objFromREST?.cmb?.stat_mod) ? 0 : parseInt(objFromREST?.cmb?.stat_mod, 10),
        modSize: isNaN(objFromREST?.cmb?.size_mod) ? 0 : parseInt(objFromREST?.cmb?.size_mod, 10),
        modMisc: isNaN(objFromREST?.cmb?.misc_mod) ? 0 : parseInt(objFromREST?.cmb?.misc_mod, 10),
        modTemp: isNaN(objFromREST?.cmb?.temp_mod) ? 0 : parseInt(objFromREST?.cmb?.temp_mod, 10)
      },
      cmd: {
        total: isNaN(objFromREST?.cmb?.defense) ? 0 : parseInt(objFromREST?.cmb?.defense, 10),
        modTemp: 0
      }
    };
  }
}

export class CombatModifiersDisplay {
  total?: number;
  modifier?: number[];
  text: string;
}

export const combatModsText: {name: string, lowerCase: string}[] = [
  {
    name: 'Melee',
    lowerCase: 'melee'
  },
  {
    name: 'Ranged',
    lowerCase: 'ranged'
  },
  {
    name: 'CMB',
    lowerCase: 'cmb'
  },
  {
    name: 'CMD',
    lowerCase: 'cmd'
  },
];
