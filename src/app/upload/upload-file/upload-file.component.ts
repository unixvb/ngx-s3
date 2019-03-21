import { Component, Input, OnDestroy } from '@angular/core';
import { ContainerEvents, FileObject, FileObjectStatus, } from '../types';
import { Router } from '@angular/router';
import { UploadService } from '../service';
import { S3ObjectsService } from '../../services/s3-objects.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnDestroy {
  @Input() fileObject: FileObject;
  @Input() oddRow: boolean;
  FileObjectStatus = FileObjectStatus;
  progress = 0;
  speed = 0;
  uploadError: string;
  uploadHandle: any;

  constructor(private uploadService: UploadService,
              private router: Router,
              private s3ObjectsService: S3ObjectsService) {
  }

  // TODO: process upload/clear from parent container
  private handleContainerEvent(containerEvent: ContainerEvents) {
    if (containerEvent === ContainerEvents.Upload) {
      return this.fileObject.status === FileObjectStatus.NotStarted && this.upload();
    } else if (containerEvent === ContainerEvents.Delete) {
      return this.clear();
    }
  }

  upload() {
    this.fileObject.status = FileObjectStatus.Uploading;
    this.uploadError = undefined;
    this.progress = 0;
    this.uploadHandle = this.uploadService.upload(this.router.url, this.fileObject.file, this.handleS3UploadProgress());
  }

  private handleS3UploadProgress() {
    return (error: Error, progress: number, speed: number) => {
      if (error) {
        this.progress = 0;
        this.speed = 0;
        this.uploadError = error.message;
        this.fileObject.status = FileObjectStatus.Failed;
      } else {
        this.progress = progress || this.progress;
        this.speed = speed || this.speed;
        if (this.progress === 100) {
          this.fileObject.status = FileObjectStatus.Uploaded;
          this.s3ObjectsService.changes$.next(true);
        }
      }
    };
  }

  clear() {
    if (this.fileObject.status !== FileObjectStatus.Uploading) {
      // TODO: remove from wrapper list
    }
  }

  ngOnDestroy() {
  }
}