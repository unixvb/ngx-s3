import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import {AWSError, CognitoIdentityCredentials, config as AWSConfig} from 'aws-sdk';

import {cognitoConfig} from '../../config/cognito';
import {SignupDataInterface} from '../models/interfaces/signup-data.interface';
import {AuthStatusCodeEnum, AuthStatusCodeType} from '../models/enums/auth-status-code.enum';
import {UserModel} from '../models/user.model';

@Injectable({providedIn: 'root'})
export class AuthService {
    private static userPoolLoginKey = `cognito-idp.${cognitoConfig.userPool.region}.amazonaws.com/${cognitoConfig.userPool.UserPoolId}`;

    public cognitoAwsCredentials: CognitoIdentityCredentials;
    public currentStatus$ = new BehaviorSubject<AuthStatusCodeType>(AuthStatusCodeEnum.signedOut);

    private userPool = new CognitoUserPool(cognitoConfig.userPool);
    private previousAppParams: any;
    private signupData: SignupDataInterface = {};

    constructor(private router: Router) {
    }

    private getCognitoUser(username?: string) {
        username = username || this.signupData.username;
        if (!username) {
            return undefined;
        }
        return new CognitoUser({
            Username: username,
            Pool: this.userPool
        });
    }

    signUp(user: SignupDataInterface, callback?: (err: Error, statusCode: string) => void) {
        const authService = this;

        this.userPool.signUp(
            user.username,
            user.password,
            [new CognitoUserAttribute({Name: 'email', Value: user.username})],
            null,
            function (err, result) {
                authService.currentStatus$.next(AuthStatusCodeEnum.signedIn);
                authService.signupData = {};
                authService.signupData.username = user.username;
                authService.signupData.password = user.password;
                callback(err, AuthStatusCodeEnum.signedIn);
            });
    }

    confirmSignUp(code: string, callback?: (err: string, statusCode: string) => void) {
        const cognitoUser = this.getCognitoUser();

        cognitoUser.confirmRegistration(code, true, function (err, result) {
            callback(err !== null ? err.message || JSON.stringify(err) : false, result);
        });
    }

    signIn(user: SignupDataInterface, callback?: (err: Error, statusCode: AuthStatusCodeType) => void) {
        const authService = this;
        const username = user.username || this.signupData.username;
        const password = user.password || this.signupData.password;
        if (!username || !password) {
            callback(new Error('AuthenticationDetails are incomplete.'),
                AuthStatusCodeEnum.uncompletedSignInData);
            return;
        } else {
            this.signupData.username = username;
            this.signupData.password = password;
        }

        const cognitoUser = this.getCognitoUser(username);
        const auth = new AuthenticationDetails({Username: username, Password: password});
        cognitoUser.authenticateUser(auth, {
            onSuccess: function (authResult) {
                authService.currentStatus$.next(AuthStatusCodeEnum.signedIn);
                authService.signupData = {};
                callback(null, AuthStatusCodeEnum.signedIn);
            },

            onFailure: function (err) {
                authService.currentStatus$.next(AuthStatusCodeEnum.unknownError);
                if (err.code === 'UserNotFoundException' || err.code === 'NotAuthorizedException') {
                    callback(err, AuthStatusCodeEnum.noSuchUser);
                } else {
                    callback(err, AuthStatusCodeEnum.unknownError);
                }
            },
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                if (!user.newPassword) {
                    const newNoNewPasswordError = new Error('First time logged in but new password is not provided');
                    if (callback) {
                        authService.currentStatus$.next(AuthStatusCodeEnum.newPasswordRequired);
                        callback(newNoNewPasswordError, AuthStatusCodeEnum.newPasswordRequired);
                        return;
                    } else {
                        throw newNoNewPasswordError;
                    }
                }
                if (authService.signupData) {
                    userAttributes = Object.assign(userAttributes, authService.signupData.additionalData);
                }
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(user.newPassword, userAttributes, this);
            }
        });
    }

    forgotPassword(username: string, callback: (error: Error, statusCode: string) => void) {
        const authService = this;
        this.signupData.username = username;
        const cognitoUser = this.getCognitoUser(username);
        cognitoUser.forgotPassword({
            onSuccess: function () {
                authService.currentStatus$.next(AuthStatusCodeEnum.verificationCodeRequired);
                callback(null, AuthStatusCodeEnum.verificationCodeRequired);
            },
            onFailure: function (err) {
                authService.currentStatus$.next(AuthStatusCodeEnum.unknownError);
                if (err.name === 'UserNotFoundException') {
                    callback(err, AuthStatusCodeEnum.noSuchUser);
                } else {
                    callback(err, AuthStatusCodeEnum.unknownError);
                }
            },
            inputVerificationCode: function (data) {
                authService.currentStatus$.next(AuthStatusCodeEnum.verificationCodeRequired);
                callback(null, AuthStatusCodeEnum.verificationCodeRequired);
            }
        });
    }

    confirmPassword(verficationCode: string, newPassword: string, callback: (error: Error, statusCode: string) => void) {
        if (!this.signupData.username) {
            callback(new Error('Username is Empty.'), AuthStatusCodeEnum.uncompletedSignInData);
            return;
        }
        const authService = this;
        const cognitoUser = new CognitoUser({
            Username: this.signupData.username,
            Pool: this.userPool
        });

        cognitoUser.confirmPassword(verficationCode, newPassword, {
            onSuccess: () => {
                authService.currentStatus$.next(AuthStatusCodeEnum.passwordChanged);
                callback(null, AuthStatusCodeEnum.success);
            },
            onFailure: (err: Error) => {
                authService.currentStatus$.next(AuthStatusCodeEnum.unknownError);
                callback(err, AuthStatusCodeEnum.unknownError);
            }
        });
    }

    signout() {
        this.userPool.getCurrentUser()?.signOut();
        this.currentStatus$.next(AuthStatusCodeEnum.signedOut);
        this.router.navigate(['/signin']);
        location.reload();
    }

    private getCurrentCognitoUser(callback: (err1?: Error, cognitoUser?: CognitoUser, groups?: string[]) => void) {
        const cognitoUser = this.userPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.getSession((err: Error, session: CognitoUserSession) => {
                if (session && session.isValid()) {
                    const groups = session.getIdToken().decodePayload()['cognito:groups'];
                    if (!this.cognitoAwsCredentials || this.cognitoAwsCredentials.needsRefresh()) {
                        this.updateAWSCredentials(session.getIdToken().getJwtToken(), cognitoUser.getUsername(), (err2) => {
                            if (err2) {
                                callback(err2);
                            } else {
                                callback(undefined, cognitoUser, groups);
                            }
                        });
                    } else {
                        callback(undefined, cognitoUser, groups);
                    }
                } else {
                    callback(undefined, undefined);
                }
            });
        } else {
            callback(undefined, undefined);
        }
    }

    getCurrentUser(callback: (error?: Error, user?: UserModel) => void) {
        this.getCurrentCognitoUser((err, cognitoUser, groups) => {
            if (cognitoUser && cognitoUser.getUsername()) {
                const identityId = this.cognitoAwsCredentials ? this.cognitoAwsCredentials.identityId : undefined;
                cognitoUser.getUserAttributes((e, array) => {
                    const emailAttribute = (array ?? []).find(value => value.getName() === 'email');
                    const email = emailAttribute !== undefined ? emailAttribute.getValue() : undefined;
                    callback(undefined, new UserModel(
                        true,
                        cognitoUser.getUsername(),
                        identityId.slice(identityId.indexOf(cognitoConfig.userPool.region), identityId.length),
                        groups,
                        email
                    ));
                });
            } else {
                callback(undefined, UserModel.default);
            }
        });
    }

    private updateAWSCredentials(sessionToken: string, username: string, callback: (err?: Error) => void) {
        const logins = {};
        logins[AuthService.userPoolLoginKey] = sessionToken;
        this.cognitoAwsCredentials = new CognitoIdentityCredentials(
            {
                IdentityPoolId: cognitoConfig.identityPool.id,
                Logins: logins,
                LoginId: username
            },
            {
                region: cognitoConfig.userPool.region
            }
        );
        // call refresh method in order to authenticate user and get new temp credentials
        this.cognitoAwsCredentials.refresh((err: AWSError) => {
            if (err) {
                callback(err);
            } else {
                AWSConfig.credentials = this.cognitoAwsCredentials;
                callback(null);
            }
        });
    }

    setPreviousAppParams(params: any) {
        this.previousAppParams = params;
    }
}
