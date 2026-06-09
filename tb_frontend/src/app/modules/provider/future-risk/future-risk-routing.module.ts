import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FutureRiskComponent} from './future-risk.component';

const routes: Routes = [{
    data: {
        layout: 'classic'
    },
    path: '',
    component: FutureRiskComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FutureRiskRoutingModule { }
