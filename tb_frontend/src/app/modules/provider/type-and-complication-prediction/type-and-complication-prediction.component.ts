import {Component, OnDestroy, OnInit} from '@angular/core';
import {PatientService} from '../../../core/patient/patient.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Lab} from './lab';
import {EaiiConfirmationService} from '../../../../@eaii/services/confirmation';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Router} from "@angular/router";

@Component({
    selector: 'app-type-and-complication-prediction',
    templateUrl: './type-and-complication-prediction.component.html',
    styleUrls: ['./type-and-complication-prediction.component.scss']
})
export class TypeAndComplicationPredictionComponent implements OnInit, OnDestroy {
    typePredictionForm: FormGroup;
    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(public patientService: PatientService,
                private router: Router,
                private confirmationService: EaiiConfirmationService,
                private formBuilder: FormBuilder) {
    }

    get form() {
        return this.typePredictionForm.controls;
    }

    ngOnInit(): void {

        if (!this.patientService.currentPatient) {
            this.router.navigate(['/home']);
        }
        this.typePredictionForm = this.formBuilder.group({
            sbp: new FormControl(null, Validators.required),
            height: new FormControl(null, Validators.required),
            weight: new FormControl(null, Validators.required),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            hptn_hx: new FormControl('No'),
            physicalActivity: new FormControl('No'),
            diabeticFamilyHistory: new FormControl('No'),
            impairedGlucose: new FormControl('No'),
            autoImmune: new FormControl('No'),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            tia_or_stroke: new FormControl('No'),
            monofilamentTest: new FormControl('No'),
            neurologicPain: new FormControl('No'),
            disautonomia: new FormControl('No'),
            footDeformity: new FormControl('No'),
            pad: new FormControl('No'),
            decreasedVision: new FormControl('No'),
            floaters: new FormControl('No'),
        });
    }

    onDiagnosis(): void {

        if (this.typePredictionForm.valid) {
            const lab: Lab = this.typePredictionForm.value;
            lab.bmi = this.patientService.calculateBMI(this.form.weight.value, this.form.height.value);
            lab.patientId = this.patientService.currentPatient.patientId;
            this.patientService.submitLab(lab)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (response) => {
                        const predictionResult = response.result;
                        this.confirmationService.showPredictionResultDialog(predictionResult);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });


        }

    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
