import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { updateSheetProperty } from '../store/campaigns/campaigns.actions';
import { Sheet } from '../shared/models/sheets/sheets.model';
import { AppState } from '../store/store.model';
import { CampaignsApiService } from './campaigns-api.service';
import { UtilsService } from './utils.service';
import { Initiative } from '../shared/models/initiative/initiative.model';
import { HitPoints } from '../shared/models/hit-points/hit-points.model';
import { Abilities, AbilitiesDisplay } from '../shared/models/abilities/abilities.model';
import { ArmorClass } from '../shared/models/armor-class/armor-class.model';
import { CombatModifiers } from '../shared/models/combat-modifiers/combat-modifiers.model';
import { Skill } from '../shared/models/skill/skill.model';
import { SavingThrowDisplay } from '../shared/models/saving-throw/saving-throw.model';

@Injectable({
  providedIn: 'root'
})
export class SheetService {
  private static abilitiesNames = [
    'Strength',
    'Dexterity',
    'Constitution',
    'Intelligence',
    'Wisdom',
    'Charisma'
  ];
  private static abilitiesAbbr = {
    STR: 'Strength',
    DEX: 'Dexterity',
    CON: 'Constitution',
    INT: 'Intelligence',
    WIS: 'Wisdom',
    CHA: 'Charisma'
  };
  private static savesNames = [
    'fortitude',
    'reflex',
    'will'
  ];
  private static combatModifiers = [
    'melee',
    'ranged',
    'cmb'
  ];

  constructor(private campaignApi: CampaignsApiService,
              private store: Store<AppState>) { }

  static computeAbilities(currentSheet: Sheet) {
    const abilities: {[abilityName: string]: AbilitiesDisplay} = {};
    this.abilitiesNames.forEach((abilityName) => {
      const isTemp = currentSheet.abilities[abilityName].tempScore !== null;
      const score = isTemp ?
        currentSheet.abilities[abilityName].tempScore :
        currentSheet.abilities[abilityName].score;
      const modifier = UtilsService.computeModifier(score);
      abilities[abilityName] = {
        score,
        modifier,
        text: UtilsService.getNumberSign(modifier),
        edited: isTemp
      };
    });
    return abilities;
  }

  static computeInitiative(initiative: Initiative, dexMod: number): [Initiative, string] {
    const init: Initiative = {
      ...initiative,
      dexMod
    };
    const initiativeValue = UtilsService.getNumberSign(
      init.dexMod +
      init.miscMod +
      init.tempMod
    );
    return [init, initiativeValue];
  }

  static computeHP(hp: HitPoints, constitution: Abilities, level: number): [number, number, number, HitPoints] {
    let maxHp = hp.maxHpTemp !== null ?
      hp.maxHpTemp :
      hp.maxHp;
    let currentHp = hp.currentHp;
    const tempHp = hp.tempHp;
    if (constitution.tempScore !== null) {
      maxHp += (UtilsService.computeModifier(constitution.tempScore) -
      UtilsService.computeModifier(constitution.score)) * level;
      if (currentHp > maxHp) {
        currentHp = maxHp;
      }
    }
    const hpValue: HitPoints = {
      ...hp,
      currentHp
    };
    return [maxHp, currentHp, tempHp, hpValue];
  }

  static computeAC(ac: ArmorClass, dexMod: number, onlySums: boolean = false): any {
    const acValue: ArmorClass = {
      ...ac,
      statMod: dexMod
    };
    const armorBonus = ac.armorBonusTemp !== null ?
      ac.armorBonusTemp :
      ac.armorBonus;
    const shieldBonus = ac.shieldBonusTemp !== null ?
      ac.shieldBonusTemp :
      ac.shieldBonus;
    const statMod = ac.statModTemp !== null ?
      ac.maxDex !== null ?
        Math.min(ac.maxDex, ac.statModTemp) :
        ac.statModTemp :
      ac.maxDex !== null ?
        Math.min(ac.maxDex, dexMod) :
        dexMod;
    const sizeMod = ac.sizeModTemp !== null ?
      ac.sizeModTemp :
      ac.sizeMod;
    const naturalArmor = ac.naturalArmorTemp !== null ?
      ac.naturalArmorTemp :
      ac.naturalArmor;
    const deflection = ac.deflectionTemp !== null ?
      ac.deflectionTemp :
      ac.deflection;
    const dodgeBonus = ac.dodgeBonusTemp !== null ?
      ac.dodgeBonusTemp :
      ac.dodgeBonus;
    const classBonus = ac.classBonusTemp !== null ?
      ac.classBonusTemp :
      ac.classBonus;
    const misc = ac.miscTemp !== null ?
      ac.miscTemp :
      ac.misc;
    const insight = ac.insightTemp !== null ?
      ac.insightTemp :
      ac.insight;
    const morale = ac.moraleTemp !== null ?
      ac.moraleTemp :
      ac.morale;
    const sacred = ac.sacredTemp !== null ?
      ac.sacredTemp :
      ac.sacred;
    const profane = ac.profaneTemp !== null ?
      ac.profaneTemp :
      ac.profane;

    const computedAC = 10 + armorBonus + shieldBonus + statMod + sizeMod + naturalArmor + deflection +
      dodgeBonus + classBonus + misc + insight + morale + sacred + profane;
    const touchAC = computedAC - armorBonus - shieldBonus - naturalArmor;
    const flatFootAC = computedAC - statMod;
    if (onlySums) {
      return [computedAC, touchAC, flatFootAC];
    } else {
      return [acValue, computedAC];
    }
  }

  static computeSaves(sheet: Sheet, abilities: {[abilityName: string]: AbilitiesDisplay}) {
    const saves: {[saveName: string]: SavingThrowDisplay} = {};
    this.savesNames.forEach((saveName) => {
      let modAbility = sheet.savingThrows[saveName].modAbility;
      let isEdited = false;
      if (saveName === 'fortitude') {
        isEdited = abilities.Constitution.edited;
        modAbility = abilities.Constitution.modifier;
      } else if (saveName === 'reflex') {
        isEdited = abilities.Dexterity.edited;
        modAbility = abilities.Dexterity.modifier;
      } else if (saveName === 'will') {
        isEdited = abilities.Wisdom.edited;
        modAbility = abilities.Wisdom.modifier;
      }
      const total = sheet.savingThrows[saveName].base +
        modAbility +
        sheet.savingThrows[saveName].feats +
        sheet.savingThrows[saveName].modMagic +
        sheet.savingThrows[saveName].modMisc +
        sheet.savingThrows[saveName].race +
        sheet.savingThrows[saveName].modTemp;
      saves[saveName] = {
        modifier: total,
        text: UtilsService.getNumberSign(total),
        edited: isEdited
      };
    });
    return saves;
  }

  static computeCombatModifiers(combatModifiers: CombatModifiers) {
    const combat: {[combatMod: string]: {total?: number, modifier?: number[], text: string}} = {};
    this.combatModifiers.forEach((combatModName) => {
      const total = UtilsService.getDecreasingToHit(
        combatModifiers[combatModName].babBonus +
        combatModifiers[combatModName].modStat +
        combatModifiers[combatModName].modSize +
        combatModifiers[combatModName].modMisc +
        combatModifiers[combatModName].modTemp,
        combatModifiers[combatModName].babBonus
      );
      combat[combatModName] = {
        modifier: total,
        text: UtilsService.getNumberSign(total[0])
      };
    });
    combat.cmd = {
      total: combatModifiers.cmd.total + combatModifiers.cmd.modTemp,
      text: (combatModifiers.cmd.total + combatModifiers.cmd.modTemp).toString()
    };
    return combat;
  }

  static getSkills(
    skillsList: string[],
    abilities: {[abilityName: string]: AbilitiesDisplay},
    totalSkills: {[skillName: string]: Skill}
  ): {
    name: string,
    ability: string,
    total: number,
    text: string,
    trained: boolean,
    edited: boolean
  }[] {
    const orderedSkills = [...skillsList];
    const outputArray = [];
    orderedSkills.sort();
    orderedSkills.forEach((skill) => {
      const ability = this.abilitiesAbbr[totalSkills[skill].ability];
      const isAbilityEdited = abilities[ability].edited;
      let modAbility = totalSkills[skill].modAbility;
      if (isAbilityEdited) {
        modAbility = abilities[ability].modifier;
      }
      const total = totalSkills[skill].ranks +
        modAbility +
        totalSkills[skill].modMisc +
        totalSkills[skill].modTemp;
      outputArray.push({
        name: skill,
        ability: totalSkills[skill].ability,
        total,
        text: UtilsService.getNumberSign(total),
        trained: !totalSkills[skill].untrained,
        edited: isAbilityEdited
      });
    });
    return outputArray;
  }

  static selectSkill(
    skillName: string,
    skill: Skill,
    abilities: {[abilityName: string]: AbilitiesDisplay}
  ): Skill {
    const isAbilityEdited = abilities[this.abilitiesAbbr[skill.ability]].edited;
    let modAbility = skill.modAbility;
    if (isAbilityEdited) {
      modAbility = abilities[this.abilitiesAbbr[skill.ability]].modifier;
    }
    return {
      ...skill,
      name: skillName,
      modAbility
    };
  }

  static onRest(maxHp: number, currHp: number, currentSheet: Sheet) {
    const currentHp = Math.min(maxHp, currHp + currentSheet.level);
    let resetCheckedList = null;
    let resetSpellsInnateRacial = null;
    let resetSpellsInnateClass = null;
    let resetSpellsKnown = null;
    if (!!currentSheet.checkLists) {
      resetCheckedList = currentSheet.checkLists.map((elem) => ({
        ...elem,
        checked: 0
      }));
    }
    if (!!currentSheet.spells?.innate?.racial) {
      resetSpellsInnateRacial = currentSheet.spells.innate.racial.map((elem) => ({
        ...elem,
        casted: 0
      }));
    }
    if (!!currentSheet.spells?.innate?.class) {
      resetSpellsInnateClass = currentSheet.spells.innate.class.map((elem) => ({
        ...elem,
        casted: 0
      }));
    }
    if (!!currentSheet.spells?.known) {
      resetSpellsKnown = cloneDeep(currentSheet.spells.known);
      for (let singleClass = 0; singleClass < resetSpellsKnown.class.length; singleClass++) {
        resetSpellsKnown.class[singleClass].level = resetSpellsKnown.class[singleClass].level.map((singleLevel) => ({
          info: {
            ...singleLevel.info,
            casted: 0,
          },
          spell: singleLevel.spell.map((singleSpell) => ({
            ...singleSpell,
            casted: 0
          }))
        }));
      }
    }
    const innateSpells = !!currentSheet.spells?.innate ?
      {
        racial: resetSpellsInnateRacial,
        class: resetSpellsInnateClass
      } : null;
    const newDayValues = {
      hp: {
        currentHp
      },
      spells: {
        innate: innateSpells,
        known: resetSpellsKnown,
        prepared: null
      },
      checkLists: !!resetCheckedList ? [...resetCheckedList] : null
    };
    return {
      newDayValues,
      currentHp,
      innateSpells,
      resetSpellsKnown,
      resetCheckedList
    };
  }

  updateSheetProperty(campaignId: string,
                      sheetId: string,
                      objForFirestore: any,
                      key: string[],
                      newValue: any[]): Observable<any> {
    return this.campaignApi.updateSheetProperty(
      campaignId,
      sheetId,
      objForFirestore
    ).pipe(
      first(),
      tap(() => {
        key.forEach((singleKey, idx) => {
          this.store.dispatch(updateSheetProperty({
            key: singleKey,
            value: newValue[idx]
          }));
        });
      })
    );
  }
}
