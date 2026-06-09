import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EaiiDrawerComponent } from '@eaii/components/drawer/drawer.component';

@NgModule({
    declarations: [
        EaiiDrawerComponent
    ],
    imports     : [
        CommonModule
    ],
    exports     : [
        EaiiDrawerComponent
    ]
})
export class EaiiDrawerModule
{
}
