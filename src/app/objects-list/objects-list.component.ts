import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { S3DirectoryModel } from '../models/s3-directory.model';
import { S3ObjectModel } from '../models/s3-object.model';
import { AuthService, User } from '../auth';
import { UploadService } from '../upload';
import { DIVIDER } from '../upload/service';
import { S3ObjectsService } from '../services/s3-objects.service';

@Component({
  selector: 'app-objects-list',
  templateUrl: './objects-list.component.html',
  styleUrls: ['./objects-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectsListComponent implements OnInit, OnDestroy {
  public signedInUser: User;
  public files: S3ObjectModel[] = [];
  public directories: S3DirectoryModel[] = [];
  public loader$ = new BehaviorSubject<boolean>(false);
  public formGroup: FormGroup;

  constructor(public router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private uploadService: UploadService,
              private s3ObjectsService: S3ObjectsService,
              private formBuilder: FormBuilder,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({ name: ['', Validators.required] });
    this.authService.getCurrentUser((err, user: User) => {
      this.signedInUser = user;
      this.uploadService.setSignedInUser(this.signedInUser);

      if (!this.signedInUser || !this.signedInUser.signedIn) {
        this.router.navigate(['/signin']);
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
    this.s3ObjectsService.changes$.subscribe(() => this.fetchData());
  }

  public onFormSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    this.uploadService.createDirectory(this.router.url, this.formGroup.value.name).send(() => this.fetchData());
  }

  public onBackButtonClick() {
    this.router.navigate([this.router.url.substring(0, this.router.url.lastIndexOf('/'))]);
  }

  selectFolder(row: S3DirectoryModel) {
    this.router.navigate([row.name], { relativeTo: this.route });
  }

  private fetchData(folder: string = this.router.url) {
    this.loader$.next(true);
    this.changeDetector.detectChanges();
    if (folder === DIVIDER) {
      this.directories = this.signedInUser.groups.map(group => ({ prefix: group, name: group }));
      this.files = [];
      this.loader$.next(false);
      this.changeDetector.detectChanges();
    } else {
      this.s3ObjectsService.list(folder)
        .then(response => {
          this.directories = response.CommonPrefixes.map(data => new S3DirectoryModel(data)).filter(data => data.name);
          this.files = response.Contents.filter(data => data.Size)
            .map(data => new S3ObjectModel(data, this.s3ObjectsService.getSignedUrl(data.Key)));
          this.loader$.next(false);
          this.changeDetector.detectChanges();
        })
        .catch(error => {
          console.log(error);
          this.loader$.next(false);
          this.changeDetector.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
  }
}
