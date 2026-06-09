import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EaiiLoadingInterceptor } from '@eaii/services/loading/loading.interceptor';

@NgModule({
    providers: [
        {
            provide : HTTP_INTERCEPTORS,
            useClass: EaiiLoadingInterceptor,
            multi   : true
        }
    ]
})
export class EaiiLoadingModule
{
}
