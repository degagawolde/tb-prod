import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {EaiiFullscreenModule} from '@eaii/components/fullscreen';
import {EaiiLoadingBarModule} from '@eaii/components/loading-bar';
import {EaiiNavigationModule} from '@eaii/components/navigation';
import {NotificationsModule} from 'app/layout/common/notifications/notifications.module';
import {SearchModule} from 'app/layout/common/search/search.module';
import {UserModule} from 'app/layout/common/user/user.module';
import {SharedModule} from 'app/shared/shared.module';
import {ClassicLayoutComponent} from 'app/layout/layouts/vertical/classic/classic.component';

@NgModule({
    declarations: [
        ClassicLayoutComponent
    ],
    imports: [
        HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        EaiiFullscreenModule,
        EaiiLoadingBarModule,
        EaiiNavigationModule,
        NotificationsModule,
        SearchModule,
        UserModule,
        SharedModule
    ],
    exports: [
        ClassicLayoutComponent
    ]
})
export class ClassicLayoutModule {
}
