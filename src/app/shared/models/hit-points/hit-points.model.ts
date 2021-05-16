export class HitPoints {
  maxHp: number;
  maxHpTemp: number;
  currentHp: number;
  tempHp: number;
  dr: string;
  rollByLevel: {
    [level: number]: number
  };

  public static from(objectFromREST: any): HitPoints {
    return {
      maxHp: parseInt(objectFromREST?.points, 10),
      maxHpTemp: null,
      currentHp: parseInt(objectFromREST?.points, 10),
      tempHp: 0,
      dr: typeof objectFromREST?.damage_reduction === 'string' ? objectFromREST?.damage_reduction : '',
      rollByLevel: objectFromREST?.history?.roll?.constructor === Object ?
        {
          [parseInt(objectFromREST?.history?.roll?.level, 10)]:
            parseInt(objectFromREST?.history?.roll?.roll, 10)
        } :
        objectFromREST?.history?.roll?.reduce((obj, x) => {
          obj[parseInt(x?.level, 10)] = parseInt(x?.roll, 10);
          return obj;
        }, {}),
    }
  }
}
