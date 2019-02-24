import { CommonPrefix } from 'aws-sdk/clients/s3';
import { DIVIDER } from '../upload/service';

export class S3DirectoryModel {
  prefix: string;
  name: string;

  constructor(data: CommonPrefix) {
    const prefixArray = data.Prefix.split(DIVIDER);

    this.prefix = data.Prefix;
    this.name = prefixArray[prefixArray.length - 2];
  }
}
