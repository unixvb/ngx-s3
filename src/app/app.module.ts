import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from './app.component';
import { AppRoutesModule } from './app-routes.module';
import {
  AuthService,
  FirstTimePasswordComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  SigninComponent,
  SignoutComponent,
  SignupComponent
} from './auth';
import { DownloadComponent, DownLoadService } from './download';
import { LoadingComponent } from './loading/component';
import { FileUploadComponent, UploadContainerComponent, UploadService } from './upload';
import { FileSizePipe } from '../utils';
import { HeaderComponent } from './core/header/header.component';
import { MainComponent } from './core/main/main.component';


@NgModule({
  declarations: [
    AppComponent,
    FirstTimePasswordComponent,
    ForgotPasswordComponent,
    MainComponent,
    LoadingComponent,
    ResetPasswordComponent,
    SigninComponent,
    SignupComponent,
    SignoutComponent,
    DownloadComponent,
    FileSizePipe,
    FileUploadComponent,
    UploadContainerComponent,
    HeaderComponent
  ],
  imports: [
    AppRoutesModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  providers: [
    AuthService,
    DownLoadService,
    UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
