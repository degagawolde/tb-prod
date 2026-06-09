import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Route, RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '../../../shared/shared.module';
import { PatientChartComponent } from './patient-chart.component';

const chartRoutes: Route[] = [
    {
        data: {
            layout: 'classic',
        },
        path: 'chart',
        component: PatientChartComponent,
    },
];

@NgModule({
    declarations: [PatientChartComponent],
    imports: [
        RouterModule.forChild(chartRoutes),
        MatIconModule,
        MatMenuModule,
        NgApexchartsModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        FormsModule,
        SharedModule,
        MatDatepickerModule,
        MatButtonModule,
        MatTabsModule,
        MatPaginatorModule,
        MatTableModule,
        MatGridListModule,
    ],
})
export class ChartModule {}
