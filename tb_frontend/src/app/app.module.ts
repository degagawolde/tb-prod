import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { EaiiConfigModule } from '@eaii/services/config';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { appConfig } from 'app/core/config/app.config';
import { CoreModule } from 'app/core/core.module';
import { LayoutModule } from 'app/layout/layout.module';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MarkdownModule } from 'ngx-markdown';
import { EaiiModule } from '../@eaii';
import { AfterSaveDialogComponent } from './modules/provider/after-save-dialog/after-save-dialog.component';
import { DiabetesTestDialogComponent } from './modules/provider/diabetes-test-dialog/diabetes-test-dialog.component';
import { PredictionResultDialogComponent } from './modules/provider/prediction-result-dialog/prediction-result-dialog.component';
import { RegistrationComponent } from './modules/provider/registration/registration.component';
import { RevisitComponent } from './modules/provider/registration/revisit/revisit.component';
import { RiskResultDialogComponent } from './modules/provider/risk-result-dialog/risk-result-dialog.component';
const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
};

@NgModule({
    declarations: [
        AppComponent,
        RegistrationComponent,
        DiabetesTestDialogComponent,
        AfterSaveDialogComponent,
        PredictionResultDialogComponent,
        RiskResultDialogComponent,
        RevisitComponent,
    ],
    imports: [
        ReactiveFormsModule,
        NgxImageZoomModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        // eaii, EaiiConfig & EaiiMockAPI
        EaiiModule,
        EaiiConfigModule.forRoot(appConfig),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        MatIconModule,
        MatStepperModule,
        FormsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatCardModule,
        MatProgressBarModule,
        MatListModule,
        MatGridListModule,
        ScrollingModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
