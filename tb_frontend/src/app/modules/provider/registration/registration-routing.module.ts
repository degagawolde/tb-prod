import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration.component';
import { RevisitComponent } from './revisit/revisit.component';

const routes: Routes = [
    {
        data: {
            layout: 'classic',
        },
        path: '',
        component: RegistrationComponent,
    },
    {
        data: {
            layout: 'classic',
        },
        path: 'revisit',
        component: RevisitComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RegistrationRoutingModule {}
