import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryRegistrationComponent } from './salary-registration/salary-registration.component';
import { SalaryCalculationComponent } from './salary-calculation/salary-calculation.component';
import { PayrollComponent } from './payroll/payroll.component';
import { Routes } from '@angular/router';

export const routes: Routes=[
  { path: '', redirectTo: 'personnel/salary-registration'},
  { path: 'personnel/salary-registration', component: SalaryRegistrationComponent, data: { titlte: '인사/급여 > 급여지급연월등록', id:1101 }},
  { path: 'personnel/salary-calculation', component: SalaryCalculationComponent, data: { title: '인사/급여 > 급여계산', id:1102 }},
  { path: 'personnel/payroll', component: PayrollComponent, data: { title: '인사/급여 > 급여대장', id:1103}}
  
]

@NgModule({ 
  imports: [
    CommonModule
  ],
  declarations: [SalaryRegistrationComponent, SalaryCalculationComponent, PayrollComponent]
})
export class PersonnelModule { }
