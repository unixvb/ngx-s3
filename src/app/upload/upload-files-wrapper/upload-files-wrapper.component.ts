import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContainerEvents, FileObject, FileObjectStatus } from '../types';
import { AuthService, User } from '../../auth';
import { UploadService } from '../service';

@Component({
  selector: 'app-upload-files-wrapper.',
  templateUrl: './upload-files-wrapper.component.html',
  styleUrls: ['./upload-files-wrapper.component.scss']
})
export class UploadFilesWrapperComponent implements OnInit {
  files: FileObject[] = [];
  signedInUser: User;

  constructor(private authService: AuthService,
              private router: Router,
              private uploadService: UploadService) {
    uploadService.fileUploadEvent$.subscribe(
      fileObject => this.handleFileUploadEvent(fileObject)
    );
  }

  private handleFileUploadEvent(fileObject: FileObject) {
    if (fileObject.status === FileObjectStatus.Deleted) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i] === fileObject) {
          this.files.splice(i, 1);
        }
      }
    }
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files.length) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        const fileObject = new FileObject(fileInput.target.files[i]);
        this.files.push(fileObject);
      }
    }
    fileInput.target.value = null;
  }

  uploadAll() {
    this.uploadService.publishUploadContainerEvent(ContainerEvents.Upload);
  }

  clearAll() {
    this.uploadService.publishUploadContainerEvent(ContainerEvents.Delete);
  }

  ngOnInit() {
    this.authService.getCurrentUser((err, user: User) => {
      this.signedInUser = user;
      this.uploadService.setSignedInUser(this.signedInUser);
      if (!this.signedInUser || !this.signedInUser.signedIn) {
        // this.authService.redirectToSignin(this.router.routerState.snapshot.root.queryParams);
        this.router.navigate(['/signin']);
        return;
      }
    });
    this.setRegion();
  }

  setRegion() {
    const queryParams = this.router.routerState.snapshot.root.queryParams;
    if (queryParams && queryParams.region) {
      this.uploadService.setRegion(queryParams.region);
    }
  }
}
