import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../models/user.model';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {CsService} from '../services/cs.service';
import {CsIndexField} from '../models/enums/cs-index-fields.enum';

@Component({
    selector: 'app-files-search',
    templateUrl: './files-search.component.html',
    styleUrls: ['./files-search.component.scss', '../objects-list/objects-list.component.scss'],
})
export class FilesSearchComponent implements OnInit {
    public formGroup: FormGroup;
    public signedInUser: UserModel;
    public CsIndexFieldsKeys = Object.keys(CsIndexField) as CsIndexField[];
    public CsIndexFields = CsIndexField;
    public files: Record<CsIndexField, string>[] = [];

    constructor(private formBuilder: FormBuilder,
                private authService: AuthService,
                private router: Router,
                private changeDetector: ChangeDetectorRef,
                private csService: CsService) {
    }

    ngOnInit(): void {
        this.formGroup = this.formBuilder.group({
            query: ['', Validators.required],
            field: [CsIndexField.everywhere, Validators.required]
        });
        this.authService.getCurrentUser((err, user: UserModel) => {
            this.signedInUser = user;

            if (!this.signedInUser || !this.signedInUser.signedIn) {
                this.router.navigate(['/signin']);
                return;
            }

            this.changeDetector.detectChanges();
        });
    }

    public getFieldName = (field: CsIndexField) => ({
        [CsIndexField.everywhere]: 'Everywhere',
        [CsIndexField.author_email]: 'Author Email',
        [CsIndexField.file_folder]: 'Folder',
        [CsIndexField.file_name]: 'File Name',
        [CsIndexField.file_type]: 'File Type',
        [CsIndexField.file_tags]: 'File Tags'
    }[field]);

    public getReadableDate = (isoString: string) => {
        const date = new Date(isoString);

        return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    }

    public navigateToFolder = (folder: string) => {
        this.router.navigate([folder]);
    }

    public onFormSubmit() {
        if (this.formGroup.invalid) {
            return;
        }
        const {query, field} = this.formGroup.value;

        this.csService.search({
            query,
            ...(field !== CsIndexField.everywhere && {queryOptions: JSON.stringify({fields: [field]})}),
        }, ((error, list) => {
            this.files = list;
            console.log(this.files);
            this.changeDetector.detectChanges();
        }));
    }
}
