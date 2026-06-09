import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ListRoutingModule} from './list-routing.module';
import {ListComponent} from './list.component';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    declarations: [
        ListComponent
    ],
    imports: [
        CommonModule,
        ListRoutingModule,
        MatTableModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class ListModule {
}
