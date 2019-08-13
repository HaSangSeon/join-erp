import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import { EmployeeComponent } from './employee/employee.component'
import { DepartmentComponent } from './department/department.component'
import { SalaryComponent } from './salary/salary.component'
import { DeductionComponent } from './deduction/deduction.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { koLocale } from 'ngx-bootstrap/locale';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PayStepComponent } from './pay-step/pay-step.component';
import { SharedModule } from '../../shared/shared.module';

export const routes: Routes = [
  { path: '', redirectTo: 'personnel/employee', pathMatch: 'full'},
  { path: 'personnel/employee', component: EmployeeComponent, data: { title: '환경설정 > 인사/급여 > 사원등록', id:371 } },
  { path: 'personnel/department', component: DepartmentComponent, data: { title: '환경설정 > 인사/급여 > 부서등록', id:372 } },
  { path: 'personnel/salary', component: SalaryComponent, data: { title: '환경설정 > 인사/급여 > 수당항목등록', id:373 } },
  { path: 'personnel/deduction', component: DeductionComponent, data: { title: '환경설정 > 인사/급여 > 공제항목등록', id:374 } },
  { path: 'personnel/pay-step', component: PayStepComponent, data: { title: '환경설정 > 인사/급여 > 호봉제임금테이블', id:375 } },
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
    EmployeeComponent,
    DepartmentComponent,
    SalaryComponent,
    DeductionComponent,
    PayStepComponent 
  ],
  providers:[
    {provide: BsDatepickerConfig, useFactory: getDatepickerConfig}
  ]
})
export class PersonnelModule { }
