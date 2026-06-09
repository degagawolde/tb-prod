import { NgModule } from '@angular/core';
import { EaiiUtilsService } from '@eaii/services/utils/utils.service';

@NgModule({
    providers: [
        EaiiUtilsService
    ]
})
export class EaiiUtilsModule
{
    /**
     * Constructor
     */
    constructor(private _eaiiUtilsService: EaiiUtilsService)
    {
    }
}
