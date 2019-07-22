import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import { NgxBarcodeModule } from 'ngx-barcode';
import { SharedModule } from '../shared/shared.module';

export const routes: Routes = [
    { path: '', redirectTo: 'session/404' }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgxBarcodeModule,
        SharedModule
    ],
    declarations: [
    ]
})

export class PrintModule { }
