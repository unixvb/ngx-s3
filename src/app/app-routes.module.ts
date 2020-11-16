import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeaderComponent } from './core/header/header.component';
import { MainComponent } from './core/main/main.component';
import { FirstTimePasswordComponent } from './auth/password/first-time/first-time.component';
import { ForgotPasswordComponent } from './auth/password/forgot/forgot.component';
import { ResetPasswordComponent } from './auth/password/reset/reset.component';
import { SigninComponent } from './auth/sign-in/sign-in.component';
import { SignupComponent } from './auth/sign-up/sign-up.component';
import {SignUpConfirmComponent} from './auth/sign-up-confirm/sign-up-confirm.component';
import {UserDetailsComponent} from './user-details/user-details.component';
import {FilesSearchComponent} from './files-search/files-search.component';
import {SystemAnalysisComponent} from './system-analysis/system-analysis.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      {
        path: 'first-time-password',
        component: FirstTimePasswordComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'signin',
        component: SigninComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'signup-confirm',
        component: SignUpConfirmComponent
      },
      {
        path: 'user-details',
        component: UserDetailsComponent
      },
      {
        path: 'search',
        component: FilesSearchComponent
      },
      {
        path: 'system-analysis',
        component: SystemAnalysisComponent
      },
      {
        path: '**',
        component: MainComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutesModule {
}
