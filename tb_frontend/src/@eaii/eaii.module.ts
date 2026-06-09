import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/legacy-form-field';
import { EaiiConfirmationModule } from '@eaii/services/confirmation';
import { EaiiLoadingModule } from '@eaii/services/loading';
import { EaiiMediaWatcherModule } from '@eaii/services/media-watcher/media-watcher.module';
import { EaiiSplashScreenModule } from '@eaii/services/splash-screen/splash-screen.module';
import { EaiiUtilsModule } from '@eaii/services/utils/utils.module';

@NgModule({
    imports  : [
        EaiiConfirmationModule,
        EaiiLoadingModule,
        EaiiMediaWatcherModule,
        EaiiSplashScreenModule,
        EaiiUtilsModule
    ],
    providers: [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true
            }
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill'
            }
        }
    ]
})
export class EaiiModule
{
    /**
     * Constructor
     */
    constructor(@Optional() @SkipSelf() parentModule?: EaiiModule)
    {
        if ( parentModule )
        {
            throw new Error('EaiiModule has already been loaded. Import this module in the AppModule only!');
        }
    }
}
