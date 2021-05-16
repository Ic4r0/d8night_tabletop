import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  static getNumberSign(numberToVerify: number): string {
    return numberToVerify > 0 ?
      '+' + numberToVerify.toString() :
      numberToVerify.toString();
  }

  static computeModifier(abilityValue: number) {
    return Math.floor(abilityValue / 2) - 5;
  }

  static getDecreasingToHit(maxNumber: number, bab: number): number[] {
    const toHitArray: number[] = [];
    let currentValue = maxNumber;
    let currentBABValue = bab;
    if (bab === 0) {
      toHitArray.push(maxNumber);
    }
    while (currentBABValue > 0) {
      toHitArray.push(currentValue);
      currentValue -= 5;
      currentBABValue -= 5;
    }
    return toHitArray;
  }

  static equals(oldArray: string[], newArray: string[]) {
    const oldArrayLength = !!oldArray ? oldArray.length : 0;
    const newArrayLength = !!newArray ? newArray.length : 0;
    if (oldArrayLength !== newArrayLength) {
      return false;
    } else if (oldArrayLength === 0 && newArrayLength === 0) {
      return true;
    }
    const uniqueValues = new Set([...oldArray, ...newArray]);
    for (const value of uniqueValues) {
      const oldCount = oldArray.filter((elem: string) => elem === value).length;
      const newCount = newArray.filter((elem: string) => elem === value).length;
      if (oldCount !== newCount) {
        return false;
      }
    }
    return true;
  }
}
