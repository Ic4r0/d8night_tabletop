export class SavingThrow {
  ability: string;
  base: number;
  modAbility: number;
  feats: number;
  modMagic: number;
  modMisc: number;
  race: number;
  modTemp: number;

  public static from(objFromREST: any): {[save: string]: SavingThrow} {
    return objFromREST.reduce((obj, x) => {
      obj[x?.name?.long] = {
        ability: x?.ability,
        base: parseInt(x?.base, 10),
        modAbility: parseInt(x?.abil_mod, 10),
        feats: parseInt(x?.feats, 10),
        modMagic: parseInt(x?.magic_mod, 10),
        modMisc: parseInt(x?.misc_mod, 10),
        race: parseInt(x?.race, 10),
        modTemp: isNaN(x?.temp_mod) ? 0 : parseInt(x?.temp_mod, 10)
      };
      return obj;
    }, {});
  }
}

export class SavingThrowDisplay {
  modifier: number;
  text: string;
  edited: boolean;
}

export const savesText: {name: string, lowerCase: string}[] = [
  {
    name: 'Fortitude',
    lowerCase: 'fortitude'
  },
  {
    name: 'Reflex',
    lowerCase: 'reflex'
  },
  {
    name: 'Will',
    lowerCase: 'will'
  },
];
