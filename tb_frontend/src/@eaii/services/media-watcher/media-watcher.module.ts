import { NgModule } from '@angular/core';
import { EaiiMediaWatcherService } from '@eaii/services/media-watcher/media-watcher.service';

@NgModule({
    providers: [
        EaiiMediaWatcherService
    ]
})
export class EaiiMediaWatcherModule
{
    /**
     * Constructor
     */
    constructor(private _eaiiMediaWatcherService: EaiiMediaWatcherService)
    {
    }
}
