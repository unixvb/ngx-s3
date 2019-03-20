import { Injectable } from '@angular/core';
import { S3Factory } from '../../utils';
import { s3Config } from '../../config';
import { DIVIDER, UploadService } from '../upload/service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class S3ObjectsService {
  private readonly region: string;
  private signedUrlExpire = 60 * 5;

  public changes$ = new Subject<boolean>();

  constructor() {
    this.region = s3Config.defaultRegion;
  }

  list(folder: string) {
    return S3Factory.getS3(this.region).listObjectsV2({
      Bucket: s3Config.buckets[this.region],
      Prefix: UploadService.reativeFolder(folder),
      Delimiter: DIVIDER
    }).promise();
  }

  getSignedUrl(key: string) {
    return S3Factory.getS3(this.region).getSignedUrl('getObject', {
      Bucket: s3Config.buckets[this.region],
      Key: key,
      Expires: this.signedUrlExpire
    });
  }

}
