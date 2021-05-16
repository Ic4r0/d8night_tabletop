export class ArmorClass {
  armorBonus: number;
  shieldBonus: number;
  statMod: number;
  sizeMod: number;
  naturalArmor: number;
  deflection: number;
  dodgeBonus: number;
  classBonus: number;
  misc: number;
  insight: number;
  morale: number;
  sacred: number;
  profane: number;
  armorBonusTemp: number;
  shieldBonusTemp: number;
  statModTemp: number;
  sizeModTemp: number;
  naturalArmorTemp: number;
  deflectionTemp: number;
  dodgeBonusTemp: number;
  classBonusTemp: number;
  miscTemp: number;
  insightTemp: number;
  moraleTemp: number;
  sacredTemp: number;
  profaneTemp: number;
  maxDex: number;
  spellFailure: number;
  checkPenalty: number;
  sr: number;

  public static from(objFromREST: any): ArmorClass {
    return {
      armorBonus: parseInt(objFromREST?.armor_bonus, 10),
      shieldBonus: parseInt(objFromREST?.shield_bonus, 10),
      statMod: parseInt(objFromREST?.stat_mod, 10),
      sizeMod: parseInt(objFromREST?.size_mod, 10),
      naturalArmor: parseInt(objFromREST?.natural, 10),
      deflection: parseInt(objFromREST?.deflection, 10),
      dodgeBonus: parseInt(objFromREST?.dodge_bonus, 10),
      classBonus: parseInt(objFromREST?.class_bonus, 10),
      misc: parseInt(objFromREST?.misc, 10),
      insight: parseInt(objFromREST?.insight, 10),
      morale: parseInt(objFromREST?.morale, 10),
      sacred: parseInt(objFromREST?.sacred, 10),
      profane: parseInt(objFromREST?.profane, 10),
      armorBonusTemp: null,
      shieldBonusTemp: null,
      statModTemp: null,
      sizeModTemp: null,
      naturalArmorTemp: null,
      deflectionTemp: null,
      dodgeBonusTemp: null,
      classBonusTemp: null,
      miscTemp: null,
      insightTemp: null,
      moraleTemp: null,
      sacredTemp: null,
      profaneTemp: null,
      maxDex: isNaN(parseInt(objFromREST?.max_dex, 10)) ?
        null :
        parseInt(objFromREST?.max_dex, 10),
      spellFailure: parseInt(objFromREST?.spell_failure, 10),
      checkPenalty: parseInt(objFromREST?.check_penalty, 10),
      sr: parseInt(objFromREST?.spell_resistance, 10),
    };
  }
}
