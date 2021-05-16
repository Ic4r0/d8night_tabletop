export class Initiative {
  total: number;
  dexMod: number;
  miscMod: number;
  tempMod: number;

  public static from(objFromREST: any): Initiative {
    return {
      total: parseInt(objFromREST?.total, 10),
      dexMod: parseInt(objFromREST?.dex_mod, 10),
      miscMod: parseInt(objFromREST?.misc_mod, 10),
      tempMod: 0
    };
  }
}
