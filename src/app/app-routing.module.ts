import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './app.auth';

import { AdminLayoutComponent } from './layout/admin/admin-layout.component';
import { AuthLayoutComponent } from './layout/auth/auth-layout.component';
import { PrintLayoutComponent } from './layout/print/print-layout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: './structure/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'accounting',
                loadChildren: './structure/accounting/accounting.module#AccountingModule'
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [{
            path: 'session',
            loadChildren: './structure/session/session.module#SessionModule'
        }]
    },
    {
        path: 'print',
        component: PrintLayoutComponent,
        loadChildren: './structure/print/print.module#PrintModule'
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
