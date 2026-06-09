import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { EaiiConfirmationService } from '@eaii/services/confirmation/confirmation.service';
import { EaiiConfirmationDialogComponent } from '@eaii/services/confirmation/dialog/dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        EaiiConfirmationDialogComponent
    ],
    imports     : [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        CommonModule
    ],
    providers   : [
        EaiiConfirmationService
    ]
})
export class EaiiConfirmationModule
{
    /**
     * Constructor
     */
    constructor(private _eaiiConfirmationService: EaiiConfirmationService)
    {
    }
}
