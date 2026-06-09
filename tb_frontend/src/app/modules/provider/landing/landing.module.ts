import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LandingComponent } from 'app/modules/provider/landing/landing.component';
import {MatIconModule} from '@angular/material/icon';
import{NgApexchartsModule} from 'ng-apexcharts';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";

const landingRoutes: Route[] = [
    {
        data: {
            layout: 'classic'
        },
        path     : '',
        component: LandingComponent
    }
];

@NgModule({
    declarations: [
        LandingComponent
    ],
    imports: [
        RouterModule.forChild(landingRoutes),
        MatIconModule,
        MatMenuModule,
        NgApexchartsModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        SharedModule,
        MatDatepickerModule,
        MatButtonModule
    ]
})
export class LandingModule
{
}
