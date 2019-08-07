import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import { AuthGuard } from '../../app.auth';
import { EmployeeComponent } from './employee/employee.component'
import { DepartmentComponent } from './department/department.component'
import { SalaryComponent } from './salary/salary.component'
import { DeductionComponent } from './deduction/deduction.component'
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
  { path: '', redirectTo: 'personnel/salary', pathMatch: 'full'},
  { path: 'personnel/employee', component: EmployeeComponent, data: { title: '환경설정 > 기본사항 > 사원등록', id:111 } },
  { path: 'personnel/department', component: DepartmentComponent, data: { title: '환경설정 > 기본사항 > 부서등록', id:112 } },
  { path: 'personnel/salary', component: SalaryComponent, data: { title: '환경설정 > 기본사항 > 수당항목등록', id:113 } },
  { path: 'personnel/deduction', component: DeductionComponent, data: { title: '환경설정 > 기본사항 > 호봉제임금테이블', id:114 } },
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
    DeductionComponent
  ],
  providers:[
    {provide: BsDatepickerConfig, useFactory: getDatepickerConfig}
  ]
})
export class PersonnelModule { }
