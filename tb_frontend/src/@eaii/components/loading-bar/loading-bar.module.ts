import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { EaiiLoadingBarComponent } from '@eaii/components/loading-bar/loading-bar.component';

@NgModule({
    declarations: [
        EaiiLoadingBarComponent
    ],
    imports     : [
        CommonModule,
        MatProgressBarModule
    ],
    exports     : [
        EaiiLoadingBarComponent
    ]
})
export class EaiiLoadingBarModule
{
}
