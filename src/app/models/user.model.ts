export class UserModel {
  static default = new UserModel(false);

  constructor(public signedIn: boolean,
              public username?: string,
              public userId?: string,
              public groups: string[] = [],
              public email?: string) {
  }
}
