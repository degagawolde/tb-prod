import {Component, Input, OnInit} from '@angular/core';
import {EaiiConfirmationService} from '../../../../@eaii/services/confirmation';
import {Router} from '@angular/router';

@Component({
    selector: 'app-risk-result-dialog',
    templateUrl: './risk-result-dialog.component.html',
    styleUrls: ['./risk-result-dialog.component.scss']
})
export class RiskResultDialogComponent implements OnInit {

    @Input() riskResult: string;

    constructor(private router: Router,
                private confirmationService: EaiiConfirmationService) {
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.confirmationService.closeRiskResultDialog();
        this.router.navigate(['/home']);
    }
}
