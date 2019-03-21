import { CommonPrefix } from 'aws-sdk/clients/s3';

import { DIVIDER } from '../services/s3-objects.service';

export class S3DirectoryModel {
  prefix: string;
  name: string;

  constructor(data: CommonPrefix) {
    const prefixArray = data.Prefix.split(DIVIDER);

    this.prefix = data.Prefix;
    this.name = prefixArray[prefixArray.length - 2];
  }
}
