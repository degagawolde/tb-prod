import { ModuleWithProviders, NgModule } from '@angular/core';
import { EaiiConfigService } from '@eaii/services/config/config.service';
import { EAII_APP_CONFIG } from '@eaii/services/config/config.constants';

@NgModule()
export class EaiiConfigModule
{
    /**
     * Constructor
     */
    constructor(private _eaiiConfigService: EaiiConfigService)
    {
    }

    /**
     * forRoot method for setting user configuration
     *
     * @param config
     */
    static forRoot(config: any): ModuleWithProviders<EaiiConfigModule>
    {
        return {
            ngModule : EaiiConfigModule,
            providers: [
                {
                    provide : EAII_APP_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
