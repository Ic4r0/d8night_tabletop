export class SpellsList {
  innate: {
    racial: Spell[];
    class: Spell[];
  };
  known: {
    class: {
      attributes: ClassSpellAttributes;
      level: ClassSpellByLevel[]
    }[]
  };
  prepared?: {
    class: {
      className: string;
      level: ClassSpellByLevel[]
    }[]
  };

  public static from(objFromREST: any): SpellsList {
    return {
      innate: 'racial_innate' in objFromREST?.spells_innate || 'class_innate' in objFromREST?.spells_innate ?
        {
          racial: Spell.fromInnateRacial(objFromREST?.spells_innate),
          class: Spell.fromInnateClass(objFromREST?.spells_innate),
        } :
        null,
      known: typeof objFromREST?.known_spells === 'string' ?
        null :
        {
          class: objFromREST?.known_spells?.class?.constructor === Object ?
            [{
              attributes: ClassSpellAttributes.from(objFromREST?.known_spells?.class),
              level: ClassSpellByLevel.from(objFromREST?.known_spells?.class)
            }] :
            objFromREST?.known_spells?.class?.map((singleClass) => ({
              attributes: ClassSpellAttributes.from(singleClass),
              level: ClassSpellByLevel.from(singleClass)
            })),
        }
    };
  }
}

export class ClassSpellAttributes {
  className: string;
  casterLevel: number;
  casterType: string;
  memorize: boolean;
  concentration: number;

  public static from(objFromREST: any): ClassSpellAttributes {
    return {
      className: objFromREST['@attributes']?.spelllistclass,
      casterLevel: parseInt(objFromREST['@attributes']?.spellcasterlevel, 10),
      casterType: objFromREST['@attributes']?.spellcastertype,
      memorize: objFromREST['@attributes']?.memorize === 'true',
      concentration: parseInt(objFromREST['@attributes']?.concentration, 10),
    };
  }
}

export class ClassSpellByLevel {
  info: {
    number: number;
    cast: number;
    casted: number;
  };
  spell: Spell[];

  public static from(objFromREST: any): ClassSpellByLevel[] {
    return objFromREST?.level?.constructor === Object ?
      [{
        info: {
          number: parseInt(objFromREST?.level['@attributes']?.number, 10),
          cast: parseInt(objFromREST?.level['@attributes']?.cast, 10),
          casted: 0,
        },
        spell: Spell.fromClass(objFromREST?.level?.spell),
      }] :
      objFromREST?.level?.filter((item) => typeof item !== 'string').map((singleLevel) => ({
        info: {
          number: parseInt(singleLevel['@attributes']?.number, 10),
          cast: parseInt(singleLevel['@attributes']?.cast, 10),
          casted: 0,
        },
        spell: Spell.fromClass(singleLevel?.spell),
      }));
  }
}

export class Spell {
  name: string;
  timesMemorized?: string;
  timesUnit?: string;
  range: string;
  components: string;
  castingtime: string;
  casterLevel: number;
  concentration: number;
  dc: number;
  duration: string;
  effect: string;
  target: string;
  saveInfo: string;
  school: string;
  spellResistance: string;
  description: string;

  public static fromInnateRacial(objFromREST: any): Spell[] {
    return !('racial_innate' in objFromREST) ||
      typeof objFromREST?.racial_innate === 'string' ?
        null :
        objFromREST?.racial_innate?.spell?.constructor === Object ?
          [{
            name: objFromREST?.racial_innate?.spell?.name,
            timesMemorized: objFromREST?.racial_innate?.spell?.times_memorized,
            timesUnit: objFromREST?.racial_innate?.spell?.times_unit,
            range: typeof objFromREST?.racial_innate?.spell?.range === 'string' ?
              objFromREST?.racial_innate?.spell?.range : null,
            components: objFromREST?.racial_innate?.spell?.components,
            castingtime: objFromREST?.racial_innate?.spell?.castingtime,
            casterLevel: parseInt(objFromREST?.racial_innate?.spell?.casterlevel, 10),
            concentration: parseInt(objFromREST?.racial_innate?.spell?.concentration, 10),
            dc: isNaN(objFromREST?.racial_innate?.spell?.dc) ?
              null :
              parseInt(objFromREST?.racial_innate?.spell?.dc, 10),
            duration: objFromREST?.racial_innate?.spell?.duration,
            effect: objFromREST?.racial_innate?.spell?.effect,
            target: objFromREST?.racial_innate?.spell?.target,
            saveInfo: objFromREST?.racial_innate?.spell?.saveinfo,
            school: objFromREST?.racial_innate?.spell?.school?.fullschool,
            spellResistance: objFromREST?.racial_innate?.spell?.spell_resistance,
            description: objFromREST?.racial_innate?.spell?.description,
          }] :
          objFromREST?.racial_innate?.spell?.map((singleSpell) => ({
            name: singleSpell?.name,
            timesMemorized: singleSpell?.times_memorized,
            timesUnit: singleSpell?.times_unit,
            range: typeof singleSpell?.range === 'string' ?
              singleSpell?.range : null,
            components: singleSpell?.components,
            castingtime: singleSpell?.castingtime,
            casterLevel: parseInt(singleSpell?.casterlevel, 10),
            concentration: parseInt(singleSpell?.concentration, 10),
            dc: isNaN(singleSpell?.dc) ?
              null :
              parseInt(singleSpell?.dc, 10),
            duration: singleSpell?.duration,
            effect: singleSpell?.effect,
            target: singleSpell?.target,
            saveInfo: singleSpell?.saveinfo,
            school: singleSpell?.school?.fullschool,
            spellResistance: singleSpell?.spell_resistance,
            description: singleSpell?.description,
          }));
  }

  public static fromInnateClass(objFromREST: any): Spell[] {
    return !('class_innate' in objFromREST) ||
      typeof objFromREST?.class_innate === 'string' ?
        null :
        objFromREST?.class_innate?.spellbook?.constructor === Object ?
          [{
            name: objFromREST?.class_innate?.spellbook?.spell?.name,
            timesMemorized: objFromREST?.class_innate?.spellbook?.spell?.times_memorized,
            timesUnit: objFromREST?.class_innate?.spellbook?.spell?.times_unit,
            range: typeof objFromREST?.class_innate?.spellbook?.spell?.range === 'string' ?
              objFromREST?.class_innate?.spellbook?.spell?.range : null,
            components: objFromREST?.class_innate?.spellbook?.spell?.components,
            castingtime: objFromREST?.class_innate?.spellbook?.spell?.castingtime,
            casterLevel: parseInt(objFromREST?.class_innate?.spellbook?.spell?.casterlevel, 10),
            concentration: parseInt(objFromREST?.class_innate?.spellbook?.spell?.concentration, 10),
            dc: isNaN(objFromREST?.class_innate?.spellbook?.spell?.dc) ?
              null :
              parseInt(objFromREST?.class_innate?.spellbook?.spell?.dc, 10),
            duration: objFromREST?.class_innate?.spellbook?.spell?.duration,
            effect: objFromREST?.class_innate?.spellbook?.spell?.effect,
            target: objFromREST?.class_innate?.spellbook?.spell?.target,
            saveInfo: objFromREST?.class_innate?.spellbook?.spell?.saveinfo,
            school: objFromREST?.class_innate?.spellbook?.spell?.school?.fullschool,
            spellResistance: objFromREST?.class_innate?.spellbook?.spell?.spell_resistance,
            description: objFromREST?.class_innate?.spellbook?.spell?.description,
          }] :
          objFromREST?.class_innate?.spellbook?.map((singleSpell) => ({
            name: singleSpell?.spell.name,
            timesMemorized: singleSpell?.spell.times_memorized,
            timesUnit: singleSpell?.spell.times_unit,
            range: typeof singleSpell?.spell.range === 'string' ?
              singleSpell?.spell.range : null,
            components: singleSpell?.spell.components,
            castingtime: singleSpell?.spell.castingtime,
            casterLevel: parseInt(singleSpell?.spell.casterlevel, 10),
            concentration: parseInt(singleSpell?.spell.concentration, 10),
            dc: isNaN(singleSpell?.spell.dc) ?
              null :
              parseInt(singleSpell?.spell.dc, 10),
            duration: singleSpell?.spell.duration,
            effect: singleSpell?.spell.effect,
            target: singleSpell?.spell.target,
            saveInfo: singleSpell?.spell.saveinfo,
            school: singleSpell?.spell.school?.fullschool,
            spellResistance: singleSpell?.spell.spell_resistance,
            description: singleSpell?.spell.description,
          }));
  }

  public static fromClass(objFromREST: any): Spell[] {
    return objFromREST?.constructor === Object ?
      [{
        name: objFromREST?.name,
        range: typeof objFromREST?.range === 'string' ?
          objFromREST?.range : null,
        components: objFromREST?.components,
        castingtime: objFromREST?.castingtime,
        casterLevel: parseInt(objFromREST?.casterlevel, 10),
        concentration: parseInt(objFromREST?.concentration, 10),
        dc: isNaN(objFromREST?.dc) ?
          null :
          parseInt(objFromREST?.dc, 10),
        duration: objFromREST?.duration,
        effect: objFromREST?.effect,
        target: objFromREST?.target,
        saveInfo: objFromREST?.saveinfo,
        school: objFromREST?.school?.fullschool,
        spellResistance: objFromREST?.spell_resistance,
        description: objFromREST?.description,
      }] :
      objFromREST?.map((singleSpell) => ({
        name: singleSpell?.name,
        range: typeof singleSpell?.range === 'string' ?
          singleSpell?.range : null,
        components: singleSpell?.components,
        castingtime: singleSpell?.castingtime,
        casterLevel: parseInt(singleSpell?.casterlevel, 10),
        concentration: parseInt(singleSpell?.concentration, 10),
        dc: isNaN(singleSpell?.dc) ?
          null :
          parseInt(singleSpell?.dc, 10),
        duration: singleSpell?.duration,
        effect: singleSpell?.effect,
        target: singleSpell?.target,
        saveInfo: singleSpell?.saveinfo,
        school: singleSpell?.school?.fullschool,
        spellResistance: singleSpell?.spell_resistance,
        description: singleSpell?.description,
      }));
  }
}
