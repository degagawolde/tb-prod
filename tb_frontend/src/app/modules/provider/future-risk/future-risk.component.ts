import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {PatientService} from '../../../core/patient/patient.service';
import {EaiiConfirmationService} from '../../../../@eaii/services/confirmation';
import {Router} from '@angular/router';

@Component({
    selector: 'app-future-risk',
    templateUrl: './future-risk.component.html',
    styleUrls: ['./future-risk.component.scss']
})
export class FutureRiskComponent implements OnInit, OnDestroy {
    riskForm: FormGroup;

    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(public patientService: PatientService,
                private router: Router,
                private confirmationService: EaiiConfirmationService,
                private formBuilder: FormBuilder) {
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    get form() {
        return this.riskForm.controls;
    }

    ngOnInit(): void {
        if (!this.patientService.currentPatient) {
            this.router.navigate(['/home']);
        }
        this.riskForm = this.formBuilder.group({
            physicalActivity: new FormControl(null, Validators.required),
            diabeticFamilyHistory: new FormControl(null, Validators.required),
            hypertension: new FormControl(null, Validators.required),
            height: new FormControl(null, Validators.required),
            weight: new FormControl(null, Validators.required),
            age: new FormControl(this.patientService.currentPatient.age, Validators.required)
        });
    }

    onCalculate(): void {
        if (this.riskForm.valid) {

            const riskData = {
                physicalActivity: this.form.physicalActivity.value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                diabeticFamilyHistory: this.form.diabeticFamilyHistory.value,
                patientId: this.patientService.currentPatient.patientId,
                gender: this.patientService.currentPatient.gender,
                hypertension: this.form.hypertension.value,
                bmi: this.patientService.calculateBMI(this.form.weight.value, this.form.height.value),
                age: this.form.age.value,
            };


            this.patientService.calculateRisk(riskData)
                .subscribe({
                    next: (resp) => {
                        this.confirmationService.openRiskResultDialog(resp.result.modelRisk);
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
