import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  FirstTimePasswordComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  SigninComponent,
  SignoutComponent,
  SignupComponent
} from './auth';
import { HomeComponent } from './home';
import { HeaderComponent } from './header/component';

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
        path: 'signout',
        component: SignoutComponent
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
        path: '**',
        component: HomeComponent
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
