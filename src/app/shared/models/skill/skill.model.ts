export class Skill {
  name?: string;
  ranks: number;
  modAbility: number;
  modMisc: number;
  modTemp: number;
  ability: string;
  untrained: boolean;
  classSkill: boolean;

  public static from(objFromREST: any) {
    return {
      points: {
        total: parseInt(objFromREST?.skillpoints?.total, 10),
        used: parseInt(objFromREST?.skillpoints?.used, 10),
        unused: parseInt(objFromREST?.skillpoints?.unused, 10),
        maxSkillLevel: parseInt(objFromREST?.max_class_skill_level, 10),
      },
      display: objFromREST?.skill?.constructor === Object ?
        [objFromREST?.skill?.name] :
        objFromREST?.skill?.length <= 16 ?
          objFromREST?.skill?.map(({name}) => name) :
          [],
      conditionalModifiers: typeof objFromREST?.conditional_modifiers === 'string' ?
        null :
        objFromREST?.conditional_modifiers?.skillbonus?.constructor === Object ?
        [
          objFromREST?.conditional_modifiers?.skillbonus?.description
        ] :
        objFromREST?.conditional_modifiers?.skillbonus?.map((singleBonus) =>
          singleBonus?.description
        ),
      skill: objFromREST?.skill?.constructor === Object ?
        {
          [objFromREST?.skill?.name]: {
            ranks: parseInt(objFromREST?.skill?.ranks, 10),
            modAbility: parseInt(objFromREST?.skill?.ability_mod['#text'][0], 10),
            modMisc: parseInt(objFromREST?.skill?.misc_mod['#text'][0], 10),
            modTemp: 0,
            ability: objFromREST?.skill?.ability,
            untrained: objFromREST?.skill?.untrained === 'Y',
            classSkill: typeof objFromREST?.skill?.classes === 'string',
          }
        } :
        objFromREST?.skill?.reduce((obj, x) => {
          obj[x?.name] = {
            ranks: parseInt(x?.ranks, 10),
            modAbility: parseInt(x?.ability_mod['#text'][0], 10),
            modMisc: parseInt(x?.misc_mod['#text'][0], 10),
            modTemp: 0,
            ability: x?.ability,
            untrained: x?.untrained === 'Y',
            classSkill: typeof x?.classes === 'string',
          };
          return obj;
        }, {}),
    };
  }
}

export class SkillDisplay {
    name?: string;
    ability: string;
    total: number;
    text: string;
    trained: boolean;
    edited: boolean;
}
