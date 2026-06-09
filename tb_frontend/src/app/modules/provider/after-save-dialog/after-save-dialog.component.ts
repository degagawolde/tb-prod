import {Component, Input, OnInit} from '@angular/core';
import {DiabetesResult} from '../registration/result.type';
import {Router} from '@angular/router';
import {EaiiConfirmationService} from '../../../../@eaii/services/confirmation';

@Component({
    selector: 'app-after-save-dialog',
    templateUrl: './after-save-dialog.component.html',
    styleUrls: ['./after-save-dialog.component.scss']
})
export class AfterSaveDialogComponent implements OnInit {

    @Input() testResult: DiabetesResult;
    @Input() revisit:boolean;
    testResultEnum = DiabetesResult;
    constructor(private router: Router,
                private confirmationService: EaiiConfirmationService) {
    }

    ngOnInit(): void {
    }

    onDetermineType(): void {
        //redirect to Determine type and complication page
        this.confirmationService.closeAfterSaveDialog();
        this.router.navigate(['/type-complication-prediction']);
    }

    onClose(): void {
        this.confirmationService.closeAfterSaveDialog();
        this.router.navigate(['/home']);
    }

    onCalculateRisk(): void {
        this.confirmationService.closeAfterSaveDialog();
        this.router.navigate(['/future-risk']);
    }
}
