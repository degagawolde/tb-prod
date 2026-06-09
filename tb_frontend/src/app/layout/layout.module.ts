import {NgModule} from '@angular/core';
import {LayoutComponent} from 'app/layout/layout.component';
import {EmptyLayoutModule} from 'app/layout/layouts/empty/empty.module';
import {ClassicLayoutModule} from 'app/layout/layouts/vertical/classic/classic.module';
import {SharedModule} from 'app/shared/shared.module';

const layoutModules = [
    // Empty
    EmptyLayoutModule,
    // Vertical navigation
    ClassicLayoutModule
];

@NgModule({
    declarations: [
        LayoutComponent
    ],
    imports: [
        SharedModule,
        ...layoutModules
    ],
    exports: [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule {
}
