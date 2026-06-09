import {Component, Input, OnInit} from '@angular/core';
import {PatientService} from '../../../core/patient/patient.service';
import {EaiiConfirmationService} from '../../../../@eaii/services/confirmation';
import {Router} from '@angular/router';

@Component({
    selector: 'app-prediction-result-dialog',
    templateUrl: './prediction-result-dialog.component.html',
    styleUrls: ['./prediction-result-dialog.component.scss']
})
export class PredictionResultDialogComponent implements OnInit {
    @Input() predictionResult: any;

    constructor(public patientService: PatientService,
                private confirmationService: EaiiConfirmationService,
                private router: Router) {
    }

    ngOnInit(): void {
        console.log(this.predictionResult)

    }

    onDone(): void {
        const data = {
            'diabeticDoctor': this.predictionResult.diabetic,
            'neuropathyDoctor': this.predictionResult.neuropathy,
            'opthalmopathyDoctor': this.predictionResult.opthalmopathy,
            'Approval': 'true',
            'feedback': '',
            'id': this.predictionResult.pk
        };
        this.patientService.approvePrediction(data)
            .subscribe({
                next: (resp) => {
                    console.log(resp);
                    this.confirmationService.closePredictionResultDialog();
                    this.router.navigate(['/home']);
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    onDecline(): void {
        this.confirmationService.closePredictionResultDialog();
        this.confirmationService.openFeedbackDialog(this.predictionResult);
    }
}
