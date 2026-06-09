import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EaiiHighlightComponent } from '@eaii/components/highlight/highlight.component';

@NgModule({
    declarations: [
        EaiiHighlightComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        EaiiHighlightComponent
    ]
})
export class EaiiHighlightModule
{
}
