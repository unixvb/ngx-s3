import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app/app.component';
import { AppRoutesModule } from './app-routes.module';
import { FileSizePipe } from '../utils';
import { HeaderComponent } from './core/header/header.component';
import { MainComponent } from './core/main/main.component';
import { LoaderComponent } from './core/loader/loader.component';
import { ObjectsListComponent } from './objects-list/objects-list.component';
import { UploadFileComponent } from './upload/upload-file/upload-file.component';
import { UploadFilesWrapperComponent } from './upload/upload-files-wrapper/upload-files-wrapper.component';
import { FirstTimePasswordComponent } from './auth/password/first-time/first-time.component';
import { ForgotPasswordComponent } from './auth/password/forgot/forgot.component';
import { ResetPasswordComponent } from './auth/password/reset/reset.component';
import { SignupComponent } from './auth/sign-up/sign-up.component';
import { SigninComponent } from './auth/sign-in/sign-in.component';


@NgModule({
  declarations: [
    AppComponent,
    FirstTimePasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SigninComponent,
    SignupComponent,
    MainComponent,
    LoaderComponent,
    ObjectsListComponent,
    FileSizePipe,
    UploadFileComponent,
    UploadFilesWrapperComponent,
    HeaderComponent
  ],
  imports: [
    AppRoutesModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
