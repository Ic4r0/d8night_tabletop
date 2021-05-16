export class Abilities {
  short: string;
  score: number;
  base: number;
  noEquip: number;
  tempScore: number;

  public static from(objFromREST: any): {[abilityName: string]: Abilities} {
    return objFromREST.reduce((obj, x) => {
      obj[x?.name?.long] = {
          short: x?.name?.short,
          score: parseInt(x?.score, 10),
          base: parseInt(x?.base, 10),
          noEquip: parseInt(x?.noequip, 10),
          tempScore: null
      };
      return obj;
    }, {});
  }
}

export class AbilitiesDisplay {
  score: number;
  modifier: number;
  text: string;
  edited: boolean;
}

export const abilitiesText: {name: string, abbr: string}[] = [
  {
    name: 'Strength',
    abbr: 'Str'
  },
  {
    name: 'Dexterity',
    abbr: 'Dex'
  },
  {
    name: 'Constitution',
    abbr: 'Con'
  },
  {
    name: 'Intelligence',
    abbr: 'Int'
  },
  {
    name: 'Wisdom',
    abbr: 'Wis'
  },
  {
    name: 'Charisma',
    abbr: 'Cha'
  },
];
