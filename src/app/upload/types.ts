export enum ContainerEvents {
  Upload,
  Delete
}

export enum FileObjectStatus {
  NotStarted,
  Uploading,
  Uploaded,
  Deleted,
  Failed
}

export class FileObject {
  status = FileObjectStatus.NotStarted;

  constructor(public file: File) { }
}
