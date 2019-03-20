import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from './app.component';
import { AppRoutesModule } from './app-routes.module';
import {
  FirstTimePasswordComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  SigninComponent,
  SignoutComponent,
  SignupComponent
} from './auth';
import { FileUploadComponent, UploadContainerComponent } from './upload';
import { FileSizePipe } from '../utils';
import { HeaderComponent } from './core/header/header.component';
import { MainComponent } from './core/main/main.component';
import { LoaderComponent } from './core/loader/loader.component';
import { ObjectsListComponent } from './objects-list/objects-list.component';


@NgModule({
  declarations: [
    AppComponent,
    FirstTimePasswordComponent,
    ForgotPasswordComponent,
    MainComponent,
    LoaderComponent,
    ResetPasswordComponent,
    SigninComponent,
    SignupComponent,
    SignoutComponent,
    ObjectsListComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
