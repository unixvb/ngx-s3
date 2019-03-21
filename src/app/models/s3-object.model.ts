import { FileSizeUtil, MonthUtil } from '../../utils';
import { DIVIDER } from '../services/s3-objects.service';

export class S3ObjectModel {
  static acceptedFileTypes = ['jpeg', 'jpg', 'png'];

  key: string;
  url: string;
  year: string;
  month: string;
  day: string;
  size: string;
  name: string;
  type: string;
  preview: boolean;

  constructor(data, signedUrl: string) {
    this.key = data.Key;
    this.url = signedUrl;
    this.year = data.LastModified.getUTCFullYear();
    this.month = MonthUtil.getName(data.LastModified.getUTCMonth());
    this.day = data.LastModified.getUTCDate();
    this.size = FileSizeUtil.transform(data.Size);
    const keyArray = this.key.split(DIVIDER);
    this.name = keyArray[keyArray.length - 1];
    this.type = this.name.substr(this.name.lastIndexOf('.') + 1);
    this.preview = S3ObjectModel.acceptedFileTypes.includes(this.type);
  }
}
