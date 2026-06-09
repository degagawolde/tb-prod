import { NgModule } from '@angular/core';
import { EaiiFindByKeyPipe } from '@eaii/pipes/find-by-key/find-by-key.pipe';

@NgModule({
    declarations: [
        EaiiFindByKeyPipe
    ],
    exports     : [
        EaiiFindByKeyPipe
    ]
})
export class EaiiFindByKeyPipeModule
{
}
