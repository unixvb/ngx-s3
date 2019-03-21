export enum FileObjectStatus {
  NotStarted,
  Uploading,
  Uploaded,
  Failed
}

export class FileObject {
  status = FileObjectStatus.NotStarted;

  constructor(public file: File) { }
}
