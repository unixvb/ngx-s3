import { FileObjectStatusEnum, FileObjectStatusType } from './enums/file-object-status.enum';

export class FileObjectModel {
  public status: FileObjectStatusType = FileObjectStatusEnum.NotStarted;

  constructor(public file: File) {
  }
}
