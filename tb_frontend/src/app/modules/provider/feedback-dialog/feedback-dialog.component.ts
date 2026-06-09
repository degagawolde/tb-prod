import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EaiiConfirmationService } from '../../../../@eaii/services/confirmation';
import { PatientService } from '../../../core/patient/patient.service';

@Component({
    selector: 'app-feedback-dialog',
    templateUrl: './feedback-dialog.component.html',
    styleUrls: ['./feedback-dialog.component.scss'],
})
export class FeedbackDialogComponent implements OnInit {
    @Input() prediction_result_id: number;
    feedbackForm: FormGroup;
    options = [
        { value: 'Healthy', label: 'Healthy' },
        { value: 'Sick', label: 'Sick' },
        { value: 'Tuberculosis', label: 'Tuberculosis' },
    ];
    constructor(
        private formBuilder: FormBuilder,
        private patientService: PatientService,
        private router: Router,
        private confirmationService: EaiiConfirmationService
    ) {}

    ngOnInit(): void {
        this.feedbackForm = this.formBuilder.group({
            result: new FormControl(null),
            approval: new FormControl(false),
            feedback: new FormControl(null),
            disease: new FormControl(null),
        });
    }

    onCancel(): void {
        this.confirmationService.closeFeedbackDialog();
        // this.router.navigate(['/home']);
    }

    onFeedbackSubmit(): void {
        this.feedbackForm.controls['result'].setValue(
            this.prediction_result_id
        );

        this.patientService.createFeedback(this.feedbackForm.value).subscribe({
            next: (resp) => {
                this.confirmationService.closeFeedbackDialog();
                // this.router.navigate(['/home']);
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
