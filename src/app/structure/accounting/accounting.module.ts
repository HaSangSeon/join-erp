import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { koLocale } from 'ngx-bootstrap/locale';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import { AuthGuard } from '../../app.auth';
import { SharedModule } from '../shared/shared.module';

import { PayableNotesComponent } from './notes/payable-notes/payable-notes.component';
import { ReceivableNotesComponent } from './notes/receivable-notes/receivable-notes.component';

export const routes: Routes = [
    { path: 'notes/payable-notes', component: PayableNotesComponent, data: { title: '관리/회계 > 지급어음명세서', id:159 }, canActivate: [AuthGuard] },
    { path: 'notes/receivable-notes', component: ReceivableNotesComponent, data: { title: '관리/회계 > 받을어음명세서', id:160 }, canActivate: [AuthGuard] },
];

// Datepicker Config
defineLocale('ko', koLocale);
export function getDatepickerConfig(): BsDatepickerConfig {
    return Object.assign(new BsDatepickerConfig(), {
        dateInputFormat: 'YYYY-MM-DD',
        showWeekNumbers: false,
        locale: 'ko'
    });
}

@NgModule({
    imports: [
        NgxDatatableModule,
        NgbModule.forRoot(),
        ModalModule.forRoot(),
        TypeaheadModule.forRoot(),
        BsDatepickerModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        PayableNotesComponent,
        ReceivableNotesComponent
    ],
    providers: [
        { provide: BsDatepickerConfig, useFactory: getDatepickerConfig }
    ]
})

export class AccountingModule { }
