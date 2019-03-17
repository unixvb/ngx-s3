import { Dictionary } from '../../types';

export class User {
  static default = new User(false);

  constructor(public signedIn: boolean, public username?: string, public userId?: string, public groups: string[] = []) {
    console.log('userId :', userId);
  }
}

export interface SignupData {
  username?: string;
  password?: string;
  newPassword?: string;
  verificationCode?: string;
  additionalData?: Dictionary<string>;
}

export interface SignupForm extends SignupData {
  confirmPassword?: string;
}
