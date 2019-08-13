import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryRegistrationComponent } from './salary-registration/salary-registration.component';
import { SalaryCalculationComponent } from './salary-calculation/salary-calculation.component';
import { PayrollComponent } from './payroll/payroll.component';
import { Routes } from '@angular/router';

export const routes: Routes=[
  { path: '', redirectTo: 'personnel/salary-registration'},
  { path: 'personnel/salary-registration', component: SalaryRegistrationComponent, data: { titlte: }},
  // { path: 'personnel/salary-'}
  
]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SalaryRegistrationComponent, SalaryCalculationComponent, PayrollComponent]
})
export class PersonnelModule { }
