import { NgModule } from '@angular/core';
import { EaiiSplashScreenService } from '@eaii/services/splash-screen/splash-screen.service';

@NgModule({
    providers: [
        EaiiSplashScreenService
    ]
})
export class EaiiSplashScreenModule
{
    /**
     * Constructor
     */
    constructor(private _eaiiSplashScreenService: EaiiSplashScreenService)
    {
    }
}
