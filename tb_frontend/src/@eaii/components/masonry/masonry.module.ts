import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EaiiMasonryComponent } from '@eaii/components/masonry/masonry.component';

@NgModule({
    declarations: [
        EaiiMasonryComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        EaiiMasonryComponent
    ]
})
export class EaiiMasonryModule
{
}
