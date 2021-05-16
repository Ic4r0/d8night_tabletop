import { User } from '../users/users.model';
import { Sheet } from '../../shared/models/sheets/sheets.model';

export interface CampaignsState {
  total: Array<Campaign>;
  list: Array<Campaign>;
  filtered: Array<Campaign>;
  filters: object;
  current: Campaign;
  currentSheet: {
    id: string,
    sheet: Sheet
  };
}

export class Campaign {
  id: string;
  name: string;
  pic: string;
  master: User;
  players: Array<User>;
  sheetSharing?: {
    [id: string]: { // sheet id
      player: User,
      sharedWith: Array<User>,
      info: {
        name: string,
        classes: Array<{
          name: string,
          level: number
        }>
        maxHp: number
      },
      isCompanion?: string,  // companion owner id
      isOwner?: string[]     // companions ids
    }
  };
  sheets?: {
    [id: string]: Sheet
  };

  static objectFromREST(obj: any): Campaign {
    const campaign: Campaign = {
      id: obj.id,
      name: obj.name,
      pic: obj.pic,
      master: User.objectFromREST(obj.master),
      players: User.arrayFromREST(obj.players),
      sheetSharing: obj.sheetSharing || null,
      sheets: {}
    };
    return campaign;
  }

  static arrayFromREST(obj: any): Array<Campaign> {
    return obj.map((x: any) => Campaign.objectFromREST(x));
  }

  static objectToREST(campaign: Campaign) {
    return {
      id: campaign.id,
      name: campaign.name,
      pic: campaign.pic,
      master: User.objectToREST(campaign.master),
      players: User.arrayToREST(campaign.players),
      sheetSharing: campaign.sheetSharing || null,
    };
  }

  static arrayToREST(campaigns: Array<Campaign>) {
    return campaigns.map((x: any) => Campaign.objectToREST(x));
  }

}
