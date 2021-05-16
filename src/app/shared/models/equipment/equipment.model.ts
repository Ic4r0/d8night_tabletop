export class Equipment {
  gold: number;
  total: {
    weight: string;
    value: string;
    load: string;
    capacity: string;
  };
  weightAllowance: {
    light: number;
    medium: number;
    heavy: number;
    lift_over_head: number;
    lift_off_ground: number;
    push_drag: number
  };
  items: EquipmentItem[];

  public static from(objFromREST: any): Equipment {
    return {
      gold: parseFloat(objFromREST.basics?.gold?.replace(/,/g, '')),
      total: 'total' in objFromREST?.equipment && objFromREST?.equipment?.total?.constructor === Object ?
        {
          weight: typeof objFromREST.equipment?.total?.weight === 'string' ?
            objFromREST.equipment?.total?.weight :
            null,
          value: typeof objFromREST.equipment?.total?.value === 'string' ?
            objFromREST.equipment?.total?.value :
            null,
          load: typeof objFromREST.equipment?.total?.load === 'string' ?
            objFromREST.equipment?.total?.load :
            null,
          capacity: typeof objFromREST.equipment?.total?.capacity === 'string' ?
            objFromREST.equipment?.total?.capacity :
            null,
        } :
        null,
      weightAllowance: {
        light: parseInt(objFromREST?.weight_allowance?.light, 10),
        medium: parseInt(objFromREST?.weight_allowance?.medium, 10),
        heavy: parseInt(objFromREST?.weight_allowance?.heavy, 10),
        lift_over_head: parseInt(objFromREST?.weight_allowance?.lift_over_head, 10),
        lift_off_ground: parseInt(objFromREST?.weight_allowance?.lift_off_ground, 10),
        push_drag: parseInt(objFromREST?.weight_allowance?.push_drag, 10)
      },
      items: EquipmentItem.from(objFromREST?.equipment)
    };
  }
}

export class EquipmentItem {
  name: string;
  charges: number;
  chargesUsed: number;
  chargesMax: number;
  contents: string[];
  cost: number;
  quantity: number;
  size: string;
  specialProperties: string;

  public static from(objFromREST: any): EquipmentItem[] {
    return 'item' in objFromREST ?
      objFromREST?.item?.constructor === Object ?
        [{
          name: objFromREST?.item?.name,
          charges: typeof objFromREST?.item?.charges === 'string' ?
            parseInt(objFromREST?.item?.charges, 10) :
            null,
          chargesUsed: typeof objFromREST?.item?.charges_used === 'string' ?
            parseInt(objFromREST?.item?.charges_used, 10) :
            null,
          chargesMax: typeof objFromREST?.item?.maxcharges === 'string' ?
            parseInt(objFromREST?.item?.maxcharges, 10) :
            null,
          contents: typeof objFromREST?.item?.contents === 'string' ?
            objFromREST?.item?.contents?.split(', ').filter((substring) => !substring.includes('lbs.')) :
            null,
          cost: typeof objFromREST?.item?.cost === 'string' ?
            parseInt(objFromREST?.item?.cost, 10) :
            null,
          quantity: typeof objFromREST?.item?.quantity === 'string' ?
            parseInt(objFromREST?.item?.quantity, 10) :
            null,
          size: typeof objFromREST?.item?.size === 'string' ?
            objFromREST?.item?.size?.long :
            null,
          specialProperties: typeof objFromREST?.item?.special_properties === 'string' ?
            objFromREST?.item?.special_properties :
            null,
        }] :
        objFromREST?.item?.map((singleItem) => ({
          name: singleItem?.name,
          charges: typeof singleItem?.charges === 'string' ?
            parseInt(singleItem?.charges, 10) :
            null,
          chargesUsed: typeof singleItem?.charges_used === 'string' ?
            parseInt(singleItem?.charges_used, 10) :
            null,
          chargesMax: typeof singleItem?.maxcharges === 'string' ?
            parseInt(singleItem?.maxcharges, 10) :
            null,
          contents: typeof singleItem?.contents === 'string' ?
            singleItem?.contents?.split(', ').filter((substring) => !substring.includes('lbs.')) :
            null,
          cost: typeof singleItem?.cost === 'string' ?
            parseInt(singleItem?.cost, 10) :
            null,
          quantity: typeof singleItem?.quantity === 'string' ?
            parseInt(singleItem?.quantity, 10) :
            null,
          size: typeof singleItem?.size === 'string' ?
            singleItem?.size?.long :
            null,
          specialProperties: typeof singleItem?.special_properties === 'string' ?
            singleItem?.special_properties :
            null,
        })) :
      null;
  }
}
