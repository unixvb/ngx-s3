import { Injectable } from '@angular/core';
import { User } from '../auth';
import { S3Factory } from '../../utils';
import { s3Config } from '../../config';
import { DIVIDER, UploadService } from '../upload/service';

@Injectable()
export class DownLoadService {

  private signedInUser: User;
  private region: string;
  private signedUrlExpireSeconds = 60 * 5;

  constructor() {
    this.region = s3Config.defaultRegion || 'us-west-1';
  }

  setSignedInUser(user: User) {
    this.signedInUser = user;
  }

  listFiles(folder: string) {
    return S3Factory.getS3(this.region).listObjectsV2({
      Bucket: s3Config.buckets[this.region],
      Prefix: [this.signedInUser.username, this.signedInUser.userId].join(DIVIDER) + UploadService.reativeFolder(folder),
      Delimiter: DIVIDER
    }).promise();
  }

  getUrl(key: string) {
    return S3Factory.getS3(this.region).getSignedUrl('getObject', {
      Bucket: s3Config.buckets[this.region],
      Key: key,
      Expires: this.signedUrlExpireSeconds
    });
  }

}
