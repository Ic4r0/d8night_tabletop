export class FeaturesObj {
  name: string;
  description: string;
  benefit?: string;
  checkCount?: number;
  checkType?: string;
  checked?: number;
  subability?: {
    name: string;
    description: string
  }[];

  public static fromChecklist(objFromREST: any): FeaturesObj[] {
    return typeof objFromREST === 'string' ?
      null :
      objFromREST?.checklist?.constructor === Object ?
        [{
          name: 'name' in objFromREST?.checklist ?
            objFromREST?.checklist?.name :
            objFromREST?.checklist?.header,
          description: objFromREST?.checklist?.description,
          checkCount: parseInt(objFromREST?.checklist?.check_count, 10),
          checkType: objFromREST?.checklist?.check_type,
          checked: 0,
          subability: 'subability' in objFromREST?.checklist ?
            objFromREST?.checklist?.subability?.constructor === Object ?
              [{
                name: objFromREST?.checklist?.subability?.name,
                description: objFromREST?.checklist?.subability?.description
              }] :
              objFromREST?.checklist?.subability?.map(({name, description}) =>
                ({name, description})) :
            null
        }] :
        objFromREST?.checklist?.map((singleChecklist) => ({
          name: 'name' in singleChecklist ?
            singleChecklist?.name :
            singleChecklist?.header,
          description: singleChecklist?.description,
          checkCount: parseInt(singleChecklist?.check_count, 10),
          checkType: singleChecklist?.check_type,
          checked: 0,
          subability: 'subability' in singleChecklist ?
            singleChecklist?.subability?.constructor === Object ?
              [{
                name: singleChecklist?.subability?.name,
                description: singleChecklist?.subability?.description
              }] :
              singleChecklist?.subability?.map(({name, description}) =>
                ({name, description})) :
            null
        }));
  }

  public static fromFeats(objFromREST: any): FeaturesObj[] {
    return 'feat' in objFromREST ?
      objFromREST?.feat?.constructor === Object ?
        [{
          name: objFromREST?.feat?.name,
          description: typeof objFromREST?.feat?.description === 'string' ?
            objFromREST?.feat?.description : '',
          benefit: typeof objFromREST?.feat?.benefit === 'string' ?
            objFromREST?.feat?.benefit : '',
        }] :
        objFromREST?.feat?.map((singleFeat) => ({
          name: singleFeat?.name,
          description: typeof singleFeat?.description === 'string' ?
            singleFeat?.description : '',
          benefit: typeof singleFeat?.benefit === 'string' ?
            singleFeat?.benefit : '',
        })) :
      null;
  }

  public static from(objFromREST: any, specificValue: string): FeaturesObj[] {
    return typeof objFromREST === 'string' ?
      null :
      objFromREST[specificValue]?.constructor === Object ?
        [{
          name: objFromREST[specificValue]?.name,
          description: typeof objFromREST[specificValue]?.description === 'string' ?
            objFromREST[specificValue]?.description : null
        }] :
        objFromREST[specificValue]?.map((singleArchetype) => ({
          name: singleArchetype?.name,
          description: typeof singleArchetype?.description === 'string' ?
            singleArchetype?.description : null
        }));
  }
}
