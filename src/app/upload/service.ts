import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ContainerEvents, FileObject } from './types';
import { S3 } from 'aws-sdk';
import { S3Factory } from '../../utils';
import { s3Config } from '../../config';

export const DIVIDER = '/';

@Injectable({ providedIn: 'root' })
export class UploadService {

  // Observable string sources
  private uploadContainerEventSource = new Subject<ContainerEvents>();
  private fileUploadEventSource = new Subject<FileObject>();

  // Observable string streams
  uploadContainerEvent$ = this.uploadContainerEventSource.asObservable();
  fileUploadEvent$ = this.fileUploadEventSource.asObservable();
  private region: string;

  constructor() {
    this.region = s3Config.defaultRegion || 'us-west-1';
  }

  static relativeFolder(folder: string) {
    return folder.substr(1) + DIVIDER;
  }

  // Upload status updates
  publishUploadContainerEvent(event: ContainerEvents) {
    this.uploadContainerEventSource.next(event);
  }

  publishFileUploadEvent(file: FileObject) {
    this.fileUploadEventSource.next(file);
  }

  setRegion(region: string) {
    this.region = region;
  }

  private preparePutObjectRequest(folder: string, file: File): S3.Types.PutObjectRequest {
    return {
      Key: this.generateKey(folder, file.name),
      Bucket: s3Config.buckets[this.region],
      Body: file,
      ContentType: file.type
    };
  }

  private preparePutDirectoryRequest(relativeDirective: string, newDirective: string): S3.Types.PutObjectRequest {
    return {
      Key: this.generateKey(relativeDirective, newDirective) + DIVIDER,
      Bucket: s3Config.buckets[this.region],
      Body: ''
    };
  }

  upload(folder: string, file: File, progressCallback: (error: Error, progress: number, speed: number) => void) {
    const s3Upload = S3Factory.getS3(this.region).upload(this.preparePutObjectRequest(folder, file));
    s3Upload.on('httpUploadProgress', this.handleS3UploadProgress(progressCallback));
    s3Upload.send(this.handleS3UploadComplete(progressCallback));
    return s3Upload;
  }

  createDirectory(relativeDirective: string, newDirective: string) {
    return S3Factory.getS3(this.region).upload(this.preparePutDirectoryRequest(relativeDirective, newDirective));
  }

  private handleS3UploadProgress
  (progressCallback: (error: Error, progress: number, speed: number) => void) {
    let uploadStartTime = new Date().getTime();
    let uploadedBytes = 0;
    return (progressEvent: S3.ManagedUpload.Progress) => {
      const currentTime = new Date().getTime();
      const timeElapsedInSeconds = (currentTime - uploadStartTime) / 1000;
      if (timeElapsedInSeconds > 0) {
        const speed = (progressEvent.loaded - uploadedBytes) / timeElapsedInSeconds;
        const progress = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
        progressCallback(undefined, progress, speed);
        uploadStartTime = currentTime;
        uploadedBytes = progressEvent.loaded;
      }
    };
  }

  private handleS3UploadComplete(
    progressCallback: (error: Error, progress: number, speed: number) => void) {
    return (error: Error, data: S3.ManagedUpload.SendData) => {
      if (error) {
        progressCallback(error, undefined, undefined);
      } else {
        progressCallback(error, 100, undefined);
      }
    };
  }

  private generateKey(folder: string, name: string) {
    return UploadService.relativeFolder(folder) + name;
  }
}
