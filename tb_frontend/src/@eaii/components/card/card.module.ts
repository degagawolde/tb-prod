import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EaiiCardComponent } from '@eaii/components/card/card.component';

@NgModule({
    declarations: [
        EaiiCardComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        EaiiCardComponent
    ]
})
export class EaiiCardModule
{
}
