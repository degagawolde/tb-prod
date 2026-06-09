import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AppEvent} from '@eaii/services/event/app.event';
import {EventQueueService} from '@eaii/services/event/event.service';
import {AppEventType} from '@eaii/services/event/event.type';
import {PatientService} from 'app/core/patient/patient.service';
import {DiabetesResult} from '../registration/result.type';

@Component({
    selector: 'app-prediction-dialog',
    templateUrl: './diabetes-test-dialog.component.html',
    styleUrls: ['./diabetes-test-dialog.component.scss']
})
export class DiabetesTestDialogComponent implements OnInit {

    sugarForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private patientService: PatientService,
        private eventService: EventQueueService
    ) {
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    get form() {
        return this.sugarForm.controls;
    }

    ngOnInit(): void {

        this.sugarForm = this.formBuilder.group({
            fbs: new FormControl(null),
            hb1: new FormControl(null)
        });
    }

    onDiagnosis(): void {

        const fbs = this.form.fbs.value;
        const hb1 = this.form.hb1.value;
        if (fbs || hb1) {

            const testResult: DiabetesResult = this.patientService.checkDiabetes(fbs, hb1);
            this.eventService.brodcast(new AppEvent(AppEventType.diabetesTestEvent, {
                result: testResult
            }));
        }
    }


}
