import { FeaturesObj } from './../feats-and-traits/features-obj.model';
import { Abilities } from '../abilities/abilities.model';
import { ArmorClass } from '../armor-class/armor-class.model';
import { CombatModifiers } from '../combat-modifiers/combat-modifiers.model';
import { Equipment } from '../equipment/equipment.model';
import { HitPoints } from '../hit-points/hit-points.model';
import { Initiative } from '../initiative/initiative.model';
import { Protection } from '../protection/protection.model';
import { SavingThrow } from '../saving-throw/saving-throw.model';
import { Skill } from '../skill/skill.model';
import { SpellsList } from '../spell/spell.model';
import { Weapon } from '../weapon/weapon.model';
import { Unarmed } from '../unarmed/unarmed.model';

export interface SheetsState {
  current: Sheet;
}

export class Sheet {
  name: string;
  level: number;
  alignment: string;
  classes: {
    name: string,
    abbr: string,
    level: number,
    sequence: number,
  }[];
  info: {
    age: number,
    bio: string,
    region: string,
    appearance: {
      eyes: string,
      hair: string,
      skin: string,
      gender: string,
      handed: string,
      height: string
    },
    gender: string,
    weight: string
  };
  deity: {
    name: string,
    alignment: string,
    description: string,
    domainlist: string,
    favoredweapon: string,
    holyitem: string,
    title: string,
  };
  languages: string;
  movement: {
      name: string,
      rate: string,
      squares: number,
    }[];
  race: string;
  reach: {
    reach: string,
    squares: number
  };
  size: string;
  vision: string;
  abilities: {
    [abilityName: string]: Abilities
  };
  hp: HitPoints;
  ac: ArmorClass;
  initiative: Initiative;
  skills: {
    points: {
      total: number,
      used: number,
      unused: number,
      maxSkillLevel: number,
    },
    display: string[],
    conditionalModifiers: string[],
    skill: {
      [skillName: string]: Skill
    }
  };
  savingThrows: {
    [save: string]: SavingThrow
  };
  combat: {
    bab: number,
    attacks: CombatModifiers,
    weapons: {
      unarmed: Unarmed,
      weapon: Weapon[],
      proficiencies: string
    }
  };
  protection: {
    armor: Protection[],
    item: Protection[],
    resistances: string[]
  };
  checkLists: FeaturesObj[];
  gear: Equipment;
  feats: FeaturesObj[];
  archetypes: FeaturesObj[];
  specialQualities: FeaturesObj[];
  specialAttacks: FeaturesObj[];
  traits: FeaturesObj[];
  spells: SpellsList;
  conditions: {
    bleed: boolean;
    blinded: boolean;
    confused: boolean;
    cowering: boolean;
    dazzled: boolean;
    deafened: boolean;
    dying: boolean;
    energyDrained: boolean;
    entangled: boolean;
    exhausted: boolean;
    fascinated: boolean;
    fatigued: boolean;
    frightned: boolean;
    grappled: boolean;
    helpless: boolean;
    invisible: boolean;
    nauseated: boolean;
    panicked: boolean;
    paralyzed: boolean;
    petrified: boolean;
    pinned: boolean;
    shaken: boolean;
    sickened: boolean;
    staggered: boolean;
    stunned: boolean;
    unconscious: boolean;
  };
  notes: string;

  static objectFromJson(sheet: any): Sheet {
    return {
      name: sheet.character.basics.name,
      level: parseInt(sheet.character.basics.classes.levels_total, 10),
      alignment: sheet.character.basics?.alignment?.long,
      classes: sheet.character.basics.classes.class.constructor === Object ?
        [{
          name: sheet.character.basics.classes.class.name,
          abbr: sheet.character.basics.classes.class.abbreviation,
          level: parseInt(sheet.character.basics.classes.class.level, 10),
          sequence: parseInt(sheet.character.basics.classes.class.sequence, 10),
        }] :
        sheet.character.basics.classes.class.map((singleClass) => ({
          name: singleClass.name,
          abbr: singleClass.abbreviation,
          level: parseInt(singleClass.level, 10),
          sequence: parseInt(singleClass.sequence, 10),
        })),
      info: {
        age: isNaN(sheet.character.basics?.age) ? null : parseInt(sheet.character.basics?.age, 10),
        bio: sheet.character.basics?.bio?.para?.length > 0 ?
          sheet.character.basics?.bio?.para.join('\n') :
          '',
        region: typeof sheet.character.basics?.region === 'string' ? sheet.character.basics?.region : null,
        appearance: {
          eyes: typeof sheet.character.basics?.eyes?.color === 'string' ? sheet.character.basics?.eyes?.color : null,
          hair: typeof sheet.character.basics?.hair?.color === 'string' ? sheet.character.basics?.hair?.color : null,
          skin: typeof sheet.character.basics?.skin?.color === 'string' ? sheet.character.basics?.skin?.color : null,
          gender: typeof sheet.character.basics?.gender?.long === 'string' ? sheet.character.basics?.gender?.long : null,
          handed: typeof sheet.character.basics?.handed === 'string' ? sheet.character.basics?.handed : null,
          height: typeof sheet.character.basics?.height?.total === 'string' ? sheet.character.basics?.height?.total : null,
        },
        gender: typeof sheet.character.basics?.gender?.long === 'string' ? sheet.character.basics?.gender?.long : null,
        weight: typeof sheet.character.basics?.weight?.weight_unit === 'string' ? sheet.character.basics?.weight?.weight_unit : null,
      },
      deity: {
        name: typeof sheet.character.basics.deity.name === 'string' ? sheet.character.basics.deity.name : '',
        alignment: typeof sheet.character.basics.deity.alignment === 'string' ? sheet.character.basics.deity.alignment : '',
        description: typeof sheet.character.basics.deity.description === 'string' ? sheet.character.basics.deity.description : '',
        domainlist: typeof sheet.character.basics.deity.domainlist === 'string' ? sheet.character.basics.deity.domainlist : '',
        favoredweapon: typeof sheet.character.basics.deity.favoredweapon === 'string' ? sheet.character.basics.deity.favoredweapon : '',
        holyitem: typeof sheet.character.basics.deity.holyitem === 'string' ? sheet.character.basics.deity.holyitem : '',
        title: typeof sheet.character.basics.deity.title === 'string' ? sheet.character.basics.deity.title : '',
      },
      languages: sheet.character.basics?.languages?.all,
      movement: sheet.character.basics.move.move.constructor === Object ?
        [{
          name: sheet.character.basics.move?.move?.name,
          rate: sheet.character.basics.move?.move?.rate,
          squares: parseInt(sheet.character.basics.move?.move?.squares, 10),
        }] :
        sheet.character.basics.move?.move?.map((singleMove) => ({
          name: singleMove?.name,
          rate: singleMove?.rate,
          squares: parseInt(singleMove?.squares, 10),
        })),
      race: sheet.character.basics?.race[0],
      reach: {
        reach: sheet.character.basics.reach?.reach,
        squares: parseInt(sheet.character.basics.reach?.squares, 10),
      },
      size: sheet.character.basics.size?.long,
      vision: typeof sheet.character.basics?.vision?.all === 'string' ?
        sheet.character.basics?.vision?.all :
        '',
      abilities: Abilities.from(sheet.character.abilities.ability),
      hp: HitPoints.from(sheet.character?.hit_points),
      ac: ArmorClass.from(sheet.character?.armor_class),
      initiative: Initiative.from(sheet.character?.initiative),
      skills: Skill.from(sheet.character?.skills),
      savingThrows: SavingThrow.from(sheet.character?.saving_throws?.saving_throw),
      combat: {
        bab: parseInt(sheet.character?.basics?.bab, 10),
        attacks: CombatModifiers.from(sheet.character?.attack),
        weapons: {
          unarmed: Unarmed.from(sheet.character?.weapons?.unarmed),
          weapon: Weapon.from(sheet.character?.weapons),
          proficiencies: typeof sheet.character?.weapon_proficiencies === 'string' ?
            sheet.character?.weapon_proficiencies :
            ''
        }
      },
      protection: {
        armor: Protection.from(sheet.character?.protection, 'armor'),
        item: Protection.from(sheet.character?.protection, 'item'),
        resistances: typeof sheet.character?.resistances === 'string' ?
          null :
          typeof sheet.character?.resistances?.resistance === 'string' ?
            [sheet.character?.resistances?.resistance] :
            sheet.character?.resistances?.resistance
      },
      checkLists: FeaturesObj.fromChecklist(sheet.character?.checklists),
      gear: Equipment.from(sheet.character),
      feats: FeaturesObj.fromFeats(sheet.character?.feats),
      archetypes: FeaturesObj.from(sheet.character?.archetypes, 'archetype'),
      specialQualities: FeaturesObj.from(sheet.character?.special_qualities, 'special_quality'),
      specialAttacks: FeaturesObj.from(sheet.character?.special_attacks, 'special_attack'),
      traits: FeaturesObj.from(sheet.character?.traits, 'trait'),
      spells: SpellsList.from(sheet.character?.spells),
      conditions: {
        bleed: false,
        blinded: false,
        confused: false,
        cowering: false,
        dazzled: false,
        deafened: false,
        dying: false,
        energyDrained: false,
        entangled: false,
        exhausted: false,
        fascinated: false,
        fatigued: false,
        frightned: false,
        grappled: false,
        helpless: false,
        invisible: false,
        nauseated: false,
        panicked: false,
        paralyzed: false,
        petrified: false,
        pinned: false,
        shaken: false,
        sickened: false,
        staggered: false,
        stunned: false,
        unconscious: false,
      },
      notes: null
    };
  }

}
