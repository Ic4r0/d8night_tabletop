export class Protection {
  name: number;
  acTotal: number;
  acCheckPenalty: number;
  maxDex: number;
  arcaneSpellFail: number;
  type: string;
  specialProperties: string;

  public static from(objFromREST: any, protectionType: string): Protection[] {
    return typeof objFromREST !== 'string' && protectionType in objFromREST ?
      objFromREST[protectionType]?.constructor === Object ?
        [{
          name: objFromREST[protectionType]?.name,
          acTotal: parseInt(objFromREST[protectionType]?.totalac, 10),
          acCheckPenalty: parseInt(objFromREST[protectionType]?.accheck, 10),
          maxDex: typeof objFromREST[protectionType]?.maxdex === 'string' ?
            parseInt(objFromREST[protectionType]?.maxdex, 10) :
            null,
          arcaneSpellFail: parseInt(objFromREST[protectionType]?.spellfail, 10),
          type: typeof objFromREST[protectionType]?.type === 'string' ?
            objFromREST[protectionType]?.type :
            '',
          specialProperties: typeof objFromREST[protectionType]?.special_properties === 'string' ?
            objFromREST[protectionType]?.special_properties :
            '',
        }] : objFromREST[protectionType]?.map((singleElem) => ({
          name: singleElem?.name,
          acTotal: parseInt(singleElem?.totalac, 10),
          acCheckPenalty: parseInt(singleElem?.accheck, 10),
          maxDex: typeof singleElem?.maxdex === 'string' ?
            parseInt(singleElem?.maxdex, 10) :
            null,
          arcaneSpellFail: parseInt(singleElem?.spellfail, 10),
          type: typeof singleElem?.type === 'string' ?
            singleElem?.type :
            '',
          specialProperties: typeof singleElem?.special_properties === 'string' ?
            singleElem?.special_properties :
            '',
        })) :
      null;
  }
}
