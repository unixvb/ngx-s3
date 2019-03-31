import { SignupDataInterface } from './signup-data.interface';

export interface SignupFormInterface extends SignupDataInterface {
  confirmPassword?: string;
}
