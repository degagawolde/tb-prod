import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FutureRiskRoutingModule } from './future-risk-routing.module';
import { FutureRiskComponent } from './future-risk.component';
import {
    TypeAndComplicationRoutingModule
} from '../type-and-complication-prediction/type-and-complication-routing.module';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';


@NgModule({
  declarations: [
    FutureRiskComponent
  ],
  imports: [
    CommonModule,
    FutureRiskRoutingModule,
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
export class FutureRiskModule { }
