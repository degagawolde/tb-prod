import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { RegistrationRoutingModule } from './registration-routing.module';

@NgModule({
    declarations: [ImageViewerComponent],
    imports: [
        CommonModule,
        MatIconModule,
        ReactiveFormsModule,
        RegistrationRoutingModule,
        NgxImageZoomModule,
        MatStepperModule,
        MatDialogModule,
        FormsModule,
        MatGridListModule,
    ],
})
export class RegistrationModule {}
