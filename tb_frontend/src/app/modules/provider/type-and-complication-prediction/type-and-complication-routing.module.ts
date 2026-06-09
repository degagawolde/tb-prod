import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TypeAndComplicationPredictionComponent} from './type-and-complication-prediction.component';

const routes: Routes = [{
    data: {
        layout: 'classic'
    },
    path: '',
    component: TypeAndComplicationPredictionComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TypeAndComplicationRoutingModule {
}
