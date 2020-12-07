import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {Subject} from 'rxjs';

import {S3ObjectsService} from '../../services/s3-objects.service';
import {FileObjectModel} from '../../models/file-object.model';
import {FileObjectStatusEnum} from '../../models/enums/file-object-status.enum';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit, OnDestroy {
    @Input()
    public fileObject: FileObjectModel;
    @Input()
    private upload$: Subject<boolean>;
    @Input()
    private authorEmail: string;
    FileObjectStatusEnum = FileObjectStatusEnum;
    progress = 0;
    speed = 0;
    uploadError: string;
    tagsForm: FormGroup;
    tagsArray: string[] = [];
    isSubmitted = false;

    @Output()
    public onRemove: EventEmitter<void> = new EventEmitter<void>();

    constructor(private router: Router,
                private s3ObjectsService: S3ObjectsService,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.tagsForm = this.fb.group({
            inputControl: new FormControl('', Validators.required)
        });
        this.upload$.pipe(untilDestroyed(this)).subscribe(() => this.onUpload());
    }

    public onAddTag(): void {
        let text = this.tagsForm.controls.inputControl.value;
        text = text.trim();

        if (text && text !== '') {
            this.tagsArray.push(text);
            this.tagsForm.controls.inputControl.reset();
        }
    }

    public onRemoveTag(tag): void {
        this.tagsArray.splice(this.tagsArray.indexOf(tag), 1);
    }

    public onUpload() {
        this.isSubmitted = true;

        if (this.tagsArray.length !== 0 &&
            this.fileObject.status === FileObjectStatusEnum.NotStarted) {
            this.fileObject.status = FileObjectStatusEnum.Uploading;
            this.uploadError = undefined;
            this.progress = 0;

            this.s3ObjectsService.uploadFile(
                decodeURIComponent(this.router.url), this.fileObject.file, this.authorEmail, this.tagsArray, this.handleS3UploadProgress()
            );
        }
    }

    private handleS3UploadProgress() {
        return (error: Error, progress: number, speed: number) => {
            if (error) {
                this.progress = 0;
                this.speed = 0;
                this.uploadError = error.message;
                this.fileObject.status = FileObjectStatusEnum.Failed;
            } else {
                this.progress = progress || this.progress;
                this.speed = speed || this.speed;
                if (this.progress === 100) {
                    this.fileObject.status = FileObjectStatusEnum.Uploaded;
                    this.s3ObjectsService.changes$.next(true);
                }
            }
        };
    }

    ngOnDestroy() {
    }
}
