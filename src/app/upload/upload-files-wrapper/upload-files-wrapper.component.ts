import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {FileObjectModel} from '../../models/file-object.model';
import {FileObjectStatusEnum} from '../../models/enums/file-object-status.enum';
import {UserModel} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-upload-files-wrapper.',
    templateUrl: './upload-files-wrapper.component.html',
    styleUrls: ['./upload-files-wrapper.component.scss']
})
export class UploadFilesWrapperComponent implements OnInit {
    public files: FileObjectModel[] = [];
    public uploadAll$ = new Subject<boolean>();
    public signedInUser: UserModel;

    constructor(private authService: AuthService,
                private router: Router,
                private changeDetector: ChangeDetectorRef,) {
    }

    fileChangeEvent(fileInput: any) {
        if (fileInput.target.files && fileInput.target.files.length) {
            for (let i = 0; i < fileInput.target.files.length; i++) {
                this.files.push(new FileObjectModel(fileInput.target.files[i]));
            }
        }
        fileInput.target.value = null;
    }

    onUploadAll() {
        this.uploadAll$.next(true);
    }

    onRemoveAll() {
        this.files = this.files.filter(file => file.status === FileObjectStatusEnum.Uploading);
    }

    onRemove(index: number) {
        if (this.files[index].status !== FileObjectStatusEnum.Uploading) {
            this.files.splice(index, 1);
        }
    }

    ngOnInit(): void {
        this.authService.getCurrentUser((err, user: UserModel) => {
            this.signedInUser = user;

            if (!this.signedInUser || !this.signedInUser.signedIn) {
                this.router.navigate(['/signin']);
                return;
            }

            this.changeDetector.detectChanges();
        });
    }
}
