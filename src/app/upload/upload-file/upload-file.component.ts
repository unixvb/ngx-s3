import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from '../service';
import { S3ObjectsService } from '../../services/s3-objects.service';
import { Subject } from 'rxjs';
import { FileObjectModel } from '../../models/file-object.model';
import { FileObjectStatusEnum } from '../../models/enums/file-object-status.enum';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, OnDestroy {
  @Input()
  public fileObject: FileObjectModel;
  @Input()
  public oddRow: boolean;
  @Input()
  private upload$: Subject<boolean>;
  FileObjectStatusEnum = FileObjectStatusEnum;
  progress = 0;
  speed = 0;
  uploadError: string;
  uploadHandle: any;

  @Output()
  public onRemove: EventEmitter<void> = new EventEmitter<void>();

  constructor(private uploadService: UploadService,
              private router: Router,
              private s3ObjectsService: S3ObjectsService) {
  }

  ngOnInit(): void {
    this.upload$.subscribe(() => this.onUpload());
  }

  public onUpload() {
    if (this.fileObject.status === FileObjectStatusEnum.NotStarted) {
      this.fileObject.status = FileObjectStatusEnum.Uploading;
      this.uploadError = undefined;
      this.progress = 0;
      this.uploadHandle = this.uploadService.upload(this.router.url, this.fileObject.file, this.handleS3UploadProgress());
    }
  }

  private handleS3UploadProgress() {
    return (error: Error, progress: number, speed: number) => {
      if (error) {
        this.progress = 0;
        this.speed = 0;
        this.uploadError = error.message;
        this.fileObject.status = FileObjectStatusEnum.Failed;
      } else {
        this.progress = progress || this.progress;
        this.speed = speed || this.speed;
        if (this.progress === 100) {
          this.fileObject.status = FileObjectStatusEnum.Uploaded;
          this.s3ObjectsService.changes$.next(true);
        }
      }
    };
  }

  ngOnDestroy() {
  }
}
