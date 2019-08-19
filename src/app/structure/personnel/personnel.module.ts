import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryRegistrationComponent } from './salary-registration/salary-registration.component';
import { SalaryCalculationComponent } from './salary-calculation/salary-calculation.component';
import { PayrollComponent } from './payroll/payroll.component';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxBarcodeModule } from 'ngx-barcode';
import { SharedModule } from '../shared/shared.module';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { koLocale } from 'ngx-bootstrap/locale';

export const routes: Routes=[
  { path: '', redirectTo: 'salary-registration'},
  { path: 'salary-registration', component: SalaryRegistrationComponent, data: { title: '인사/급여 > 급여지급연월등록', id:1101 }},
  { path: 'salary-calculation', component: SalaryCalculationComponent, data: { title: '인사/급여 > 급여계산', id:1102 }},
  { path: 'payroll', component: PayrollComponent, data: { title: '인사/급여 > 급여대장', id:1103}}
  
]


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
  declarations: [SalaryRegistrationComponent, SalaryCalculationComponent, PayrollComponent],
  providers:[
    {provide: BsDatepickerConfig, useFactory: getDatepickerConfig}
  ]
})
export class PersonnelModule { }
