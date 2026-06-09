import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TypeAndComplicationPredictionComponent} from './type-and-complication-prediction.component';
import {TypeAndComplicationRoutingModule} from './type-and-complication-routing.module';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';


@NgModule({
    declarations: [
        TypeAndComplicationPredictionComponent
    ],
    imports: [
        CommonModule,
        TypeAndComplicationRoutingModule,
        MatIconModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class TypeAndComplicationPredictionModule {
}
