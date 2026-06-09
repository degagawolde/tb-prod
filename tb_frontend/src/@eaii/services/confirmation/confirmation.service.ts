import { Injectable } from '@angular/core';
import {
    MatLegacyDialog as MatDialog,
    MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { EaiiConfirmationConfig } from '@eaii/services/confirmation/confirmation.types';
import { EaiiConfirmationDialogComponent } from '@eaii/services/confirmation/dialog/dialog.component';
import { AfterSaveDialogComponent } from 'app/modules/provider/after-save-dialog/after-save-dialog.component';
import { DiabetesResult } from 'app/modules/provider/registration/result.type';
import { merge } from 'lodash-es';
import { DiabetesTestDialogComponent } from '../../../app/modules/provider/diabetes-test-dialog/diabetes-test-dialog.component';
import { FeedbackDialogComponent } from '../../../app/modules/provider/feedback-dialog/feedback-dialog.component';
import { PredictionResultDialogComponent } from '../../../app/modules/provider/prediction-result-dialog/prediction-result-dialog.component';
import { RiskResultDialogComponent } from '../../../app/modules/provider/risk-result-dialog/risk-result-dialog.component';

@Injectable()
export class EaiiConfirmationService {
    private predDialogRef;
    private feedbackDialogRef;
    private riskResultDialogRef;
    private predictionResultDialogRef;
    private afterSaveDialogRef;

    private _defaultConfig: EaiiConfirmationConfig = {
        title: 'Confirm action',
        message: 'Are you sure you want to confirm this action?',
        icon: {
            show: true,
            name: 'heroicons_outline:exclamation',
            color: 'warn',
        },
        actions: {
            confirm: {
                show: true,
                label: 'Confirm',
                color: 'warn',
            },
            cancel: {
                show: true,
                label: 'Cancel',
            },
        },
        dismissible: false,
    };

    /**
     * Constructor
     */
    constructor(private _matDialog: MatDialog) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    open(
        config: EaiiConfirmationConfig = {}
    ): MatDialogRef<EaiiConfirmationDialogComponent> {
        // Merge the user config with the default config
        const userConfig = merge({}, this._defaultConfig, config);

        // Open the dialog
        return this._matDialog.open(EaiiConfirmationDialogComponent, {
            autoFocus: false,
            disableClose: !userConfig.dismissible,
            data: userConfig,
            panelClass: 'eaii-confirmation-dialog-panel',
        });
    }

    showDiabetesTestDialog(): MatDialogRef<DiabetesTestDialogComponent> {
        // Open the dialog
        this.predDialogRef = this._matDialog.open(DiabetesTestDialogComponent, {
            autoFocus: false,
            disableClose: false,
            panelClass: 'eaii-confirmation-dialog-panel',
        });
        return this.predDialogRef;
    }

    openFeedbackDialog(
        predictionResult: any
    ): MatDialogRef<FeedbackDialogComponent> {
        // Open the dialog
        this.feedbackDialogRef = this._matDialog.open(FeedbackDialogComponent, {
            autoFocus: false,
            disableClose: false,
            panelClass: 'eaii-confirmation-dialog-panel',
        });
        const instance = this.feedbackDialogRef.componentInstance;
        instance.prediction_result_id = predictionResult;
        return this.feedbackDialogRef;
    }

    openRiskResultDialog(
        riskResult: string
    ): MatDialogRef<FeedbackDialogComponent> {
        // Open the dialog
        this.riskResultDialogRef = this._matDialog.open(
            RiskResultDialogComponent,
            {
                autoFocus: false,
                disableClose: true,
                panelClass: 'eaii-confirmation-dialog-panel',
            }
        );
        const instance = this.riskResultDialogRef.componentInstance;
        instance.riskResult = riskResult;
        return this.riskResultDialogRef;
    }

    closeRiskResultDialog(): void {
        this.riskResultDialogRef.close();
    }

    closeFeedbackDialog(): void {
        this.feedbackDialogRef.close();
    }

    closeDiabetesTestDialog(): void {
        this.predDialogRef.close();
    }

    showPredictionResultDialog(
        predictionResult: any
    ): MatDialogRef<PredictionResultDialogComponent> {
        // Open the dialog
        this.predictionResultDialogRef = this._matDialog.open(
            PredictionResultDialogComponent,
            {
                autoFocus: false,
                disableClose: true,
                panelClass: 'eaii-confirmation-dialog-panel',
            }
        );
        const instance = this.predictionResultDialogRef.componentInstance;
        instance.predictionResult = predictionResult;
        return this.predictionResultDialogRef;
    }

    closePredictionResultDialog(): void {
        this.predictionResultDialogRef.close();
    }

    showAfterSaveDialog(
        result: DiabetesResult,
        revisit: boolean
    ): MatDialogRef<AfterSaveDialogComponent> {
        // Open the dialog
        this.afterSaveDialogRef = this._matDialog.open(
            AfterSaveDialogComponent,
            {
                autoFocus: false,
                disableClose: false,
                panelClass: 'eaii-confirmation-dialog-panel',
            }
        );
        const instance = this.afterSaveDialogRef.componentInstance;
        instance.testResult = result;
        instance.revisit = revisit;
        return this.afterSaveDialogRef;
    }

    closeAfterSaveDialog(): void {
        console.log('closing after save');
        this.afterSaveDialogRef.close();
    }
}
