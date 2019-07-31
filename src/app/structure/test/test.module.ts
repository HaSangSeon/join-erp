import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import { AuthGuard } from '../../app.auth';
import { Test1Component } from './test1/test1.component'
import { Test2Component } from './test2/test2.component'
import { Test3Component } from './test3/test3.component'
import { Test4Component } from './test4/test4.component'
import { AppModule } from '../../app.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { koLocale } from 'ngx-bootstrap/locale';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SharedModule } from '../shared/shared.module';

export const routes: Routes = [
  { path: '', redirectTo: 'test/test1', pathMatch: 'full'},
  { path: 'test/test1', component: Test1Component, data: { title: '환경설정 > 기본사항 > 사원등록', id:111 } },
  { path: 'test/test2', component: Test2Component, data: { title: '환경설정 > 기본사항 > 부서등록', id:112 } },
  { path: 'test/test3', component: Test3Component, data: { title: '환경설정 > 기본사항 > 수당항목등록', id:113 } },
  { path: 'test/test4', component: Test4Component, data: { title: '환경설정 > 기본사항 > 호봉제임금테이블', id:114 } },
];

defineLocale('ko', koLocale);
export function getDatepickerConfig(): BsDatepickerConfig{
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: 'YYYY-MM-DD',
    showWeekNumbers: false,
    locale:'ko'
  })
  
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
    NgxBarcodeModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports:[
  ],
  declarations: [
    Test1Component,
    Test2Component,
    Test3Component,
    Test4Component
  ],
  providers:[
    {provide: BsDatepickerConfig, useFactory: getDatepickerConfig}
  ]
})
export class TestModule { }
