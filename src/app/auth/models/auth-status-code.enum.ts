export enum AuthStatusCodeEnum {
  success = 'success',
  signedIn = 'signedIn',
  signedOut = 'signedOut',
  uncompletedSignInData = 'uncompletedSignInData',
  newPasswordRequired = 'newPasswordRequired',
  verificationCodeRequired = 'verificationCodeRequired',
  passwordChanged = 'passwordChanged',
  noSuchUser = 'noSuchUser',
  unknownError = 'unknownError'
}

export type AuthStatusCodeType
  = AuthStatusCodeEnum.success
  | AuthStatusCodeEnum.signedIn
  | AuthStatusCodeEnum.signedOut
  | AuthStatusCodeEnum.uncompletedSignInData
  | AuthStatusCodeEnum.newPasswordRequired
  | AuthStatusCodeEnum.verificationCodeRequired
  | AuthStatusCodeEnum.passwordChanged
  | AuthStatusCodeEnum.noSuchUser
  | AuthStatusCodeEnum.unknownError;
