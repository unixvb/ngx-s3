import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DownLoadService } from './service';
import { AuthService, User } from '../auth';
import { S3ObjectModel } from '../models/s3-object.model';
import { S3DirectoryModel } from '../models/s3-directory.model';
import { filter } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '../upload';
import { S3ObjectsRefreshService } from '../services/s3-objects-refresh.service';

@Component({
  selector: 'app-download',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class DownloadComponent implements OnInit, OnDestroy {
  public signedInUser: any;
  public files: S3ObjectModel[] = [];
  public directories: S3DirectoryModel[] = [];
  public loader$ = new BehaviorSubject<boolean>(false);
  public formGroup: FormGroup;

  constructor(public router: Router,
              private authService: AuthService,
              private uploadService: UploadService,
              private downloadService: DownLoadService,
              private formBuilder: FormBuilder,
              private refreshService: S3ObjectsRefreshService) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({ name: ['', Validators.required] });
    this.authService.getCurrentUser((err, user: User) => {
      this.signedInUser = user;
      this.uploadService.setSignedInUser(this.signedInUser);
      this.downloadService.setSignedInUser(this.signedInUser);

      if (!this.signedInUser || !this.signedInUser.signedIn) {
        this.router.navigate(['signin']);
        return;
      }

      this.fetchData();
      this.router.events
        .pipe(
          filter(e => e instanceof NavigationEnd),
          untilDestroyed(this)
        )
        .subscribe((event: NavigationEnd) => this.fetchData(event.urlAfterRedirects));
    });
    this.refreshService.changes$.subscribe(() => this.fetchData());
  }

  public onFormSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    this.uploadService.createDirectory(this.router.url, this.formGroup.value.name).send(() => this.fetchData());
  }

  private fetchData(folder: string = this.router.url) {
    this.loader$.next(true);
    this.downloadService.listFiles(folder).subscribe(
      response => {
        this.directories = response.CommonPrefixes.map(data => new S3DirectoryModel(data));
        this.files = response.Contents.filter(data => data.Size).map(data => new S3ObjectModel(data, this.downloadService));
        this.loader$.next(false);
        console.log('sts');
      },
      error => {
        console.log(error);
        this.loader$.next(false);
      }
    );
  }

  ngOnDestroy(): void {
  }
}
