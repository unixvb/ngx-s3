import { AuthStatusCodeType } from './auth-status-code.enum';

export class AuthResponseModel {
  status: AuthStatusCodeType;
  error?: Error;

  constructor(status: AuthStatusCodeType, error: Error = null) {
    this.status = status;
    this.error = error;
  }
}
