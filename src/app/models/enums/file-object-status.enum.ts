export enum FileObjectStatusEnum {
  NotStarted,
  Uploading,
  Uploaded,
  Failed
}

export type FileObjectStatusType
  = FileObjectStatusEnum.NotStarted
  | FileObjectStatusEnum.Uploading
  | FileObjectStatusEnum.Uploaded
  | FileObjectStatusEnum.Failed;
