import { Dictionary } from '../../../types/dictionary';

export interface SignupDataInterface {
  username?: string;
  password?: string;
  newPassword?: string;
  verificationCode?: string;
  additionalData?: Dictionary<string>;
}
