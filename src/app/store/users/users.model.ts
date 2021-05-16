export interface UsersState {
  list: Array<User>;
  filters: object;
  filtered: Array<User>;
  current: User;
}

export class User {
  uid: string;
  displayName: string;
  email?: string;
  photoURL: string;
  privacyConsent?: boolean;
  auth?: {
    basic?: boolean,
    player?: boolean,
    admin?: boolean
  };

  static objectFromREST(obj: any): User {
    return {
      uid: obj.uid,
      displayName: obj.displayName,
      email: obj.email,
      photoURL: obj.photoURL,
      privacyConsent: obj?.privacyConsent || false,
      auth: {
        basic: obj.auth?.basic ? true : false,
        player: obj.auth?.player ? true : false,
        admin: obj.auth?.admin ? true : false
      }
    };
  }

  static arrayFromREST(obj: any): Array<User> {
    return obj.map((x: any) => User.objectFromREST(x));
  }

  static objectToREST(user: User) {
    return {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      privacyConsent: user.privacyConsent,
      auth: {
        basic: user.auth.basic,
        player: user.auth.player,
        admin: user.auth.admin
      }
    };
  }

  static arrayToREST(users: Array<User>) {
    return users.map((x: any) => User.objectToREST(x));
  }
}
