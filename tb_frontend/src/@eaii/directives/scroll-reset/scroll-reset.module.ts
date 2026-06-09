import { NgModule } from '@angular/core';
import { EaiiScrollResetDirective } from '@eaii/directives/scroll-reset/scroll-reset.directive';

@NgModule({
    declarations: [
        EaiiScrollResetDirective
    ],
    exports     : [
        EaiiScrollResetDirective
    ]
})
export class EaiiScrollResetModule
{
}
