import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EventQueueService } from '@eaii/services/event/event.service';
import { AppEventType } from '@eaii/services/event/event.type';
import { FileUploadService } from '@eaii/services/file-upload/file-upload.service';
import { AuthService } from 'app/core/auth/auth.service';
import { PatientService } from 'app/core/patient/patient.service';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { EaiiConfirmationService } from '../../../../@eaii/services/confirmation';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { Feedback, Patient } from './patient';

@Component({
    selector: 'app-registration',
    styleUrls: ['./registration.component.css'],
    templateUrl: './registration.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: { showError: true },
        },
    ],
})
export class RegistrationComponent implements OnInit, AfterViewInit, OnDestroy {
    private vbaseUrl = environment.vbaseUrl;
    url: string =
        'https://images.unsplash.com/photo-1631651363531-fd29aec4cb5c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    imageHeight: number = 100;
    imageWidth: number = 300;
    registrationForm: FormGroup;
    feedbackForm: FormGroup;
    regionList = [
        { name: 'Addis Ababa' },
        { name: 'Amhara Region' },
        { name: 'Afar' },
        { name: 'Benishangul-Gumuz' },
        { name: 'Oromiya' },
        { name: 'Somali' },
        { name: 'Southern Nations, Nationalities, and Peoples Region (SNNPR)' },
        { name: 'Gambela' },
        { name: 'Dire Dawa' },
        { name: 'Harari' },
        { name: 'Sidama' },
        { name: 'Tigray' },
        { name: 'South West' },
    ];

    destroy$: Subject<boolean> = new Subject<boolean>();
    previewImg: BehaviorSubject<string> = new BehaviorSubject<string>('');
    prediction_class$: BehaviorSubject<string> = new BehaviorSubject<string>(
        ''
    );
    prediction_loc$: BehaviorSubject<string> = new BehaviorSubject<string>('');

    secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    });

    isLinear = false;

    selectedFiles?: FileList;
    selectedFileNames: string[] = [];

    progressInfos: any;
    message: string[] = [];
    public dialogRef: any;
    previews: string[] = [];
    prediction_loc: string = '';
    prediction_class: string = '';
    prediction_result_id: number;
    approval: boolean = true;
    showProgress: boolean = false;
    // feedback:string = "";

    options = [
        { value: 'Healthy', label: 'Healthy' },
        { value: 'Sick', label: 'Sick' },
        { value: 'Tuberculosis', label: 'Tuberculosis' },
    ];

    constructor(
        private formBuilder: FormBuilder,
        private eventService: EventQueueService,
        private patientService: PatientService,
        private userService: UserService,
        private _matDialog: MatDialog,
        private authService: AuthService,
        private _formBuilder: FormBuilder,
        private uploadService: FileUploadService,
        private confirmation_service: EaiiConfirmationService,
        private _ngZone: NgZone
    ) {}

    ngOnInit(): void {
        this.registrationForm = this.formBuilder.group({
            patientId: new FormControl(null, Validators.required),
            firstName: new FormControl(null),
            lastName: new FormControl(null),
            age: new FormControl(null),
            gender: new FormControl(null),
            woreda: new FormControl(null),
            region: new FormControl(null),
            zone: new FormControl(null),
            job: new FormControl(null),
            kebele: new FormControl(null),
            phonenumber: new FormControl(null, Validators.required),
            user: new FormControl(null),
        });

        this.feedbackForm = this.formBuilder.group({
            result: new FormControl(null),
            approval: new FormControl(null),
            feedback: new FormControl(null),
            disease: new FormControl(null),
        });
    }

    @ViewChild('autosize') autosize: CdkTextareaAutosize;

    triggerResize() {
        // Wait for changes to be applied, then trigger textarea resize.
        this._ngZone.onStable
            .pipe(take(1))
            .subscribe(() => this.autosize.resizeToFitContent(true));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    ngAfterViewInit() {
        //subscribe to events
        this.eventService
            .on(AppEventType.diabetesTestEvent)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
                console.log('got event');
                this.confirmation_service.closeDiabetesTestDialog();
                // this.savePatient(event.payload.result);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    saveFeedback(): void {
        this.feedbackForm.controls['result'].setValue(
            this.prediction_result_id
        );
        this.feedbackForm.controls['approval'].setValue(this.approval);
        if (this.feedbackForm.valid) {
            const feedbackPost: Feedback = this.feedbackForm.value;
            this.patientService.createFeedback(feedbackPost).subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.patientService.setCurrentFeedback(resp);
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            console.log(this.feedbackForm.errors);
        }
    }

    savePatient(): void {
        this.registrationForm.controls['user'].setValue(
            this.userService.user$.source['_buffer'][0].id
        );
        if (this.registrationForm.valid) {
            const patientPost: Patient = this.registrationForm.value;
            this.patientService.addPatient(patientPost).subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.patientService.setCurrentPatient(resp);
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            console.log(this.registrationForm.errors);
        }
    }

    selectFiles(event: any): void {
        this.message = [];
        this.progressInfos = [];
        this.selectedFileNames = [];
        this.selectedFiles = event.target.files;

        this.previews = [];
        if (this.selectedFiles && this.selectedFiles[0]) {
            const numberOfFiles = this.selectedFiles.length;
            for (let i = 0; i < numberOfFiles; i++) {
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    console.log(e.target.result);
                    this.previews.push(e.target.result);
                    this.previewImg.next(e.target.result);
                };

                reader.readAsDataURL(this.selectedFiles[i]);

                this.selectedFileNames.push(this.selectedFiles[i].name);
            }
        }
    }

    updatePreviewImage(): void {
        if (this.previews.length > 0) {
            const previewImage = this.previews[0];
            // Use the previewImage as needed, e.g., update an <img> element
        }
    }

    upload(idx: number, file: File): void {
        this.progressInfos = { value: 0, fileName: file.name };
        this.showProgress = true;

        if (file) {
            this.uploadService
                .upload(
                    file,
                    this.userService.user$.source['_buffer'][0].id,
                    this.patientService.currentPatient.patientId
                )
                .subscribe(
                    (event: any) => {
                        if (event.type === HttpEventType.UploadProgress) {
                            const progress = Math.round(
                                (100 * event.loaded) / event.total
                            );
                            this.progressInfos.value = progress;
                            console.log(this.progressInfos);
                        } else if (event instanceof HttpResponse) {
                            const msg =
                                'Uploaded the file successfully: ' + file.name;
                            this.message.push(msg);
                            console.log(event['body'].loc_prediction);

                            this.prediction_loc = `${this.vbaseUrl}${event['body'].loc_prediction}`;
                            console.log(this.prediction_loc);
                            this.prediction_loc$.next(this.prediction_loc);

                            this.prediction_class =
                                event['body'].class_prediction;
                            this.prediction_class$.next(
                                event['body'].class_prediction
                            );
                            this.prediction_result_id = event['body'].id;

                            // this.uploadService.getFiles(event['body'].loc_prediction).subscribe({
                            //     next: (resp) => {
                            //         console.log(resp)

                            //     },
                            //     error: (err) => {
                            //         console.log(err);
                            //     }
                            // });
                        }
                    },
                    (err: any) => {
                        this.progressInfos[idx].value = 0;
                        const msg = 'Could not upload the file: ' + file.name;
                        this.message.push(msg);
                    }
                );
        }
    }

    uploadFiles(): void {
        this.message = [];

        if (this.selectedFiles) {
            for (let i = 0; i < this.selectedFiles.length; i++) {
                this.upload(i, this.selectedFiles[i]);
            }
        }
    }

    onViewImage(uri: string) {
        // Open the dialog
        this.dialogRef = this._matDialog.open(ImageViewerComponent, {
            autoFocus: false,
            disableClose: false,
            panelClass: 'custom-dialog-panel',
            width: '70%',
            height: '90%',
        });
        let instance = this.dialogRef.componentInstance;
        instance.imageUrl = uri;
    }

    openModal() {
        this.confirmation_service.openFeedbackDialog(this.prediction_result_id);
    }

    closeDialog() {
        this.dialogRef.close();
    }

    getPatient() {
        return this.patientService.currentPatient;
    }
}
