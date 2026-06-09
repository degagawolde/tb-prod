import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { EaiiAlertComponent } from '@eaii/components/alert/alert.component';

@NgModule({
    declarations: [
        EaiiAlertComponent
    ],
    imports     : [
        CommonModule,
        MatButtonModule,
        MatIconModule
    ],
    exports     : [
        EaiiAlertComponent
    ]
})
export class EaiiAlertModule
{
}
