import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../auth';
import { Subject } from 'rxjs';
import { FileObjectModel } from '../../models/file-object.model';
import { FileObjectStatusEnum } from '../../models/enums/file-object-status.enum';

@Component({
  selector: 'app-upload-files-wrapper.',
  templateUrl: './upload-files-wrapper.component.html',
  styleUrls: ['./upload-files-wrapper.component.scss']
})
export class UploadFilesWrapperComponent implements OnInit {
  public files: FileObjectModel[] = [];
  signedInUser: User;
  public uploadAll$ = new Subject<boolean>();

  constructor(private authService: AuthService,
              private router: Router) {
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files.length) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        this.files.push(new FileObjectModel(fileInput.target.files[i]));
      }
    }
    fileInput.target.value = null;
  }

  onUploadAll() {
    this.uploadAll$.next(true);
  }

  onRemoveAll() {
    this.files = this.files.filter(file => file.status === FileObjectStatusEnum.Uploading);
  }

  onRemove(index: number) {
    if (this.files[index].status !== FileObjectStatusEnum.Uploading) {
      this.files.splice(index, 1);
    }
  }

  ngOnInit() {
    this.authService.getCurrentUser((err, user: User) => {
      this.signedInUser = user;
      if (!this.signedInUser || !this.signedInUser.signedIn) {
        this.router.navigate(['/signin']);
        return;
      }
    });
  }
}
