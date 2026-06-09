import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDatepickerComponent } from './custom-datepicker/custom-datepicker.component';
import { YearPickerComponent } from './year-picker/year-picker.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CustomDatepickerComponent
    ],
    declarations: [
      CustomDatepickerComponent,
      YearPickerComponent,

    ]
})
export class SharedModule
{
}
