import { NgModule } from '@angular/core';
import { EaiiScrollbarDirective } from '@eaii/directives/scrollbar/scrollbar.directive';

@NgModule({
    declarations: [
        EaiiScrollbarDirective
    ],
    exports     : [
        EaiiScrollbarDirective
    ]
})
export class EaiiScrollbarModule
{
}
