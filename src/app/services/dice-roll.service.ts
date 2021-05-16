import { Injectable } from '@angular/core';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class DiceRollService {

  constructor(private toastr: CustomToastrService) { }

  public parseRoll(stringRoll: string, rollName: string) {
    const checkForMinus = stringRoll.split('-');
    let modifiers = 0;
    const minusValues = checkForMinus.slice(1);
    if (minusValues.some((value) => value.includes('d'))) {
      this.toastr.error({name: 'Wrong parameters', message: 'Unexpected parameters passed as inputs'});
      return null;
    } else if (minusValues.length > 0) {
      const minusValuesNumber = minusValues.map((value) => parseInt(value, 10));
      modifiers -= minusValuesNumber.reduce((total, curr) => total + curr);
    }
    const checkForPlus = checkForMinus[0].split('+');

    const onlyMods = checkForPlus.filter((value) => !value.includes('d'));
    if (onlyMods.length > 0) {
      const modsValuesNumber = onlyMods.map((value) => parseInt(value, 10));
      modifiers += modsValuesNumber.reduce((total, curr) => total + curr);
    }

    const onlyDice = checkForPlus.filter((value) => value.includes('d'));
    const dices = {
      d100: 0,
      d20: 0,
      d12: 0,
      d10: 0,
      d8: 0,
      d6: 0,
      d4: 0,
      d3: 0,
      d2: 0
    };
    for (const singleDice of onlyDice) {
      const splitted = singleDice.split('d');
      dices['d' + splitted[1]] = dices['d' + splitted[1]] + parseInt(splitted[0], 10);
    }

    this.genericRoll(
      dices,
      modifiers,
      rollName
    );
  }

  public rollD20(
    diceNumber: number,
    mod: number | string | number[] | string[] = 0,
    roll: string = ''): void {
    if (Array.isArray(mod)) {
      let toastrTitle = 'Roll';
      if (!!roll) {
        toastrTitle = roll;
      }
      let completeResults = '';
      if (mod.length < 6) {
        mod.forEach((singleMod, idx) => {
          const {dice, result, total} =
            this.getRollResult({d20: diceNumber}, singleMod);
          completeResults += '<i>' + (idx + 1).toString() + '° roll:</i></br>' +
            dice + '</br>' +
            '<i>Result:</i></br>' +
            result + ' = <b>' + total.toString() + '</b>';
          if (idx !== mod.length - 1) {
            completeResults += '<hr>';
          }
        });
      } else {
        mod.forEach((singleMod, idx) => {
          const {dice, result, total} =
            this.getRollResult({d20: diceNumber}, singleMod);
          completeResults += '<i>' + (idx + 1).toString() + '° roll: </i><b>' + total.toString() + '</b>';
          if (idx !== mod.length - 1) {
            completeResults += '<hr>';
          }
        });
      }
      this.toastr.info(completeResults, toastrTitle);
    } else {
      this.genericRoll({d20: diceNumber}, mod, roll);
    }
  }

  public genericRoll(
    diceValues: {[dice: string]: number},
    mod: number | string = 0,
    roll: string = ''
  ): void {
    const {dice, result, total} = this.getRollResult(diceValues, mod);

    let toastrTitle = 'Roll';
    if (!!roll) {
      toastrTitle = roll;
    }
    this.toastr.info(
      '<i>Roll:</i></br>' + dice + '</br><i>Result:</i></br>' + result + ' = <b>' + total.toString() + '</b>',
      toastrTitle
    );
  }

  private getRollResult(
    diceValues: {[dice: string]: number},
    mod: number | string = 0
  ): {dice: string, result: string, total: number} {
    const MOD = typeof mod === 'string' ? parseInt(mod, 10) : mod;
    const D100: number[] = Array.apply(
      null,
      Array(!!diceValues.d100 ? diceValues.d100 : 0)
    ).map(() => this.roll(100));
    const D20: number[] = Array.apply(
      null,
      Array(!!diceValues.d20 ? diceValues.d20 : 0)
    ).map(() => this.roll(20));
    const D12: number[] = Array.apply(
      null,
      Array(!!diceValues.d12 ? diceValues.d12 : 0)
    ).map(() => this.roll(12));
    const D10: number[] = Array.apply(
      null,
      Array(!!diceValues.d10 ? diceValues.d10 : 0)
    ).map(() => this.roll(10));
    const D8: number[] = Array.apply(
      null,
      Array(!!diceValues.d8 ? diceValues.d8 : 0)
    ).map(() => this.roll(8));
    const D6: number[] = Array.apply(
      null,
      Array(!!diceValues.d6 ? diceValues.d6 : 0)
    ).map(() => this.roll(6));
    const D4: number[] = Array.apply(
      null,
      Array(!!diceValues.d4 ? diceValues.d4 : 0)
    ).map(() => this.roll(4));
    const D3: number[] = Array.apply(
      null,
      Array(!!diceValues.d3 ? diceValues.d3 : 0)
    ).map(() => this.roll(3));
    const D2: number[] = Array.apply(
      null,
      Array(!!diceValues.d2 ? diceValues.d2 : 0)
    ).map(() => this.roll(2));
    const dice: string = this.diceRolledToString(diceValues, MOD);
    const result: string = this.resultToString(
      [D100, D20, D12, D10, D8, D6, D4, D3, D2],
      MOD
    );
    const total =
      D100.reduce((a, b) => a + b, 0) +
      D20.reduce((a, b) => a + b, 0) +
      D12.reduce((a, b) => a + b, 0) +
      D10.reduce((a, b) => a + b, 0) +
      D8.reduce((a, b) => a + b, 0) +
      D6.reduce((a, b) => a + b, 0) +
      D4.reduce((a, b) => a + b, 0) +
      D3.reduce((a, b) => a + b, 0) +
      D2.reduce((a, b) => a + b, 0) +
      MOD;

    return {
      dice,
      result,
      total
    };
  }

  private roll(diceSides: number): number {
    return Math.floor(Math.random() * diceSides) + 1;
  }

  private diceRolledToString(
    diceValues: {[dice: string]: number},
    mod: number = 0
  ): string {
    const output: string[] = [];
    if (Object.keys(diceValues).length > 0) {
      for (const key of Object.keys(diceValues)) {
        if (!!diceValues[key]) {
          output.push(diceValues[key].toString() + key);
        }
      }
    }
    if (mod !== 0) {
      output.push(mod.toString());
    }
    return output.join(' + ');
  }

  private resultToString(
    results: number[][],
    mod: number = 0
  ): string {
    const output: string[] = [];
    results.forEach((singleDiceRolls: number[]) => {
      if (singleDiceRolls.length > 0) {
        output.push(
          '(' +
          singleDiceRolls.map((num: number) => num.toString()).join('+') +
          ')'
        );
      }
    });
    if (mod !== 0) {
      output.push(mod.toString());
    }
    return output.join(' + ');
  }
}
