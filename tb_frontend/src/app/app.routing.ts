import {Route} from '@angular/router';
import {AuthGuard} from 'app/core/auth/guards/auth.guard';
import {NoAuthGuard} from 'app/core/auth/guards/noAuth.guard';
import {LayoutComponent} from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'home'},
    // Redirect signed in user to the '/home'
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.

    {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'registration'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [

            {
                path: 'forgot-password',
                loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)
            },
            {
                path: 'reset-password',
                loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)
            },
            {
                path: 'sign-in',
                loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)
            }

        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {
                path: 'sign-in',
                loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)
            }

        ]
    },

    // landing
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        children: [
            {
                path: 'home',
                loadChildren: () => import('app/modules/provider/landing/landing.module').then(m => m.LandingModule)
            },
        ]
    },
// Error
    {
        path: 'error', children: [
            {
                path: '404',
                loadChildren: () => import('app/modules/error-404/error-404.module').then(m => m.Error404Module)
            },
        ]
    },
    // registration
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        children: [
            {
                path: 'registration',
                loadChildren: () => import('app/modules/provider/registration/registration.module').then(m => m.RegistrationModule)
            },
        ]
    },

    // chart
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        children: [
            {
                path: 'patients',
                loadChildren: () => import('app/modules/provider/patient-chart/chart.module').then(m => m.ChartModule)
            },
        ]
    },

    // type and complication
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        children: [
            {
                path: 'type-complication-prediction',
                loadChildren: () => import('app/modules/provider/type-and-complication-prediction/type-and-complication-prediction.module').then(m => m.TypeAndComplicationPredictionModule)
            },
        ]
    },
// future risk
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        children: [

            {
                path: 'future-risk',
                loadChildren: () => import('app/modules/provider/future-risk/future-risk.module').then(m => m.FutureRiskModule)
            },
        ]
    },

    // feedback module
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('app/modules/provider/feedback-dialog/feedback-dialog.module').then(m => m.FeedbackDialogModule)
            },
        ]
    },

    // List
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        children: [
            {
                path: 'list',
                loadChildren: () => import('app/modules/provider/list/list.module').then(m => m.ListModule)
            },
        ]
    },
    // 404 & Catch all
    {
        path: '404',
        pathMatch: 'full',
        loadChildren: () => import('app/modules/error-404/error-404.module').then(m => m.Error404Module)
    },
    {path: '**', redirectTo: '404'}
];
