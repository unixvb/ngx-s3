import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { S3 } from 'aws-sdk';

import { S3Factory } from '../../utils';
import { s3Config } from '../../config';

export const DIVIDER = '/';

@Injectable({ providedIn: 'root' })
export class S3ObjectsService {

  constructor() {
    this.region = s3Config.defaultRegion;
  }

  private readonly region: string;
  private signedUrlExpire = 60 * 5;

  public changes$ = new Subject<boolean>();

  private static relativeFolder(folder: string) {
    return folder.substr(1) + DIVIDER;
  }

  private static generateKey(folder: string, name: string) {
    return S3ObjectsService.relativeFolder(folder) + name;
  }

  public list(folder: string) {
    return S3Factory.getS3(this.region).listObjectsV2({
      Bucket: s3Config.buckets[this.region],
      Prefix: S3ObjectsService.relativeFolder(folder),
      Delimiter: DIVIDER
    }).promise();
  }

  public uploadFile(folder: string, file: File, progressCallback: (error: Error, progress: number, speed: number) => void) {
    const s3Upload = S3Factory.getS3(this.region).upload({
      Key: S3ObjectsService.generateKey(folder, file.name),
      Bucket: s3Config.buckets[this.region],
      Body: file,
      ContentType: file.type
    });
    s3Upload.on('httpUploadProgress', this.handleS3UploadProgress(progressCallback));
    s3Upload.send(this.handleS3UploadComplete(progressCallback));
    return s3Upload;
  }

  public createFolder(relativePath: string, name: string) {
    return S3Factory.getS3(this.region).upload({
      Key: S3ObjectsService.generateKey(relativePath, name) + DIVIDER,
      Bucket: s3Config.buckets[this.region],
      Body: ''
    });
  }

  public getSignedUrl(key: string) {
    return S3Factory.getS3(this.region).getSignedUrl('getObject', {
      Bucket: s3Config.buckets[this.region],
      Key: key,
      Expires: this.signedUrlExpire
    });
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
}
