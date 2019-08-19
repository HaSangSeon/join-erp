import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Item } from './salary-registration.item';
import { MessageService } from '../../../message.service';
import { DatePipe } from '@angular/common';
import { AppGlobals } from '../../../app.globals';
import { ActivatedRoute } from '@angular/router';
import { SalaryRegistrationService } from './salary-registration.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-salary-registration',
  templateUrl: './salary-registration.component.html',
  styleUrls: ['./salary-registration.component.scss']
})
export class SalaryRegistrationComponent implements OnInit {
  inputForm: FormGroup;

  panelTitle: string;
  inputFormTitle: string;
  errorMessage: string;

  isExecutable: boolean = false;
  isEditMode: boolean = false;
  isLoadingProgress: boolean = false;

  rows=[];
  temp=[];
  m_object=[];
  bonus_no=[];
  listData: Item[];

  messages = this.globals.datatableMessages;
  gridHeight = this.globals.gridHeight;

  addOkMsg = "등록이 안료되었습니다.";
  editOkMsg = "수정이 완료 되었습니다.";

  @ViewChild('InputFormModal') inputFormModal: ModalDirective;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private messageService: MessageService,
    private globals: AppGlobals,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dataService: SalaryRegistrationService
  ) {

    this.inputForm = fb.group({
      year: ['', Validators.required],
      month: ['', Validators.required],
      pay_num:[''],
      pay_type:['', Validators.required],
      tax_calculation: [''],
      s_period: ['', Validators.required],
      e_period: ['', Validators.required],
      pay_year: ['', Validators.required],
      pay_month: ['', Validators.required],
      pay_day: ['', Validators.required],
      year_end_adjust: ['']
    });

    for(var i=1; i<=12; i++){
      this.m_object.push(i);
    }
    for(var i=1; i<=9; i++){
      this.bonus_no.push(i);
    }

  }

  ngOnInit() {
    this.panelTitle = '급여지급연월'
    this.inputFormTitle = "급여지급연월등록"
    this.getAll();
  }

  getAll(): void {
    let formData = this.inputForm.value;
    let params = {
    }
    this.isLoadingProgress = true;
    this.dataService.GetAll(params).subscribe(
      listData => {
        this.listData = listData;
        this.temp = listData['data'];
        this.rows = listData['data'];

        this.isLoadingProgress = false;
      }
    );
  }

  openModal(method, id) {

    if (method == 'write') {
      this.inputFormModal.show();
    }

    if (method == 'write') {
      if (id) {
        this.isEditMode = true;
      } else {
        this.inputForm.reset();
        this.isEditMode = false;
      }
    }

  }

  Save() {
    let formData = this.inputForm.value;
    formData.pay_num = formData.pay_num * 1;
    formData.pay_type = formData.pay_type * 1;
    formData.tax_calculation = formData.tax_calculation * 1;
    formData.s_period = this.datePipe.transform(formData.s_period, 'yyyy-MM-dd');
    formData.e_period = this.datePipe.transform(formData.e_period, 'yyyy-MM-dd');
    formData.pay_day = this.datePipe.transform(formData.pay_day, 'yyyy-MM-dd');

    this.dataService.Save(formData)
    .subscribe(
      data => {
        if (data['result'] == 'success') {
          this.inputForm.reset();
          this.messageService.add(this.addOkMsg);
        } else {
          this.messageService.add(data['errorMessage'])
        }
        this.inputFormModal.hide();
      },
      error => this.errorMessage = <any>error
    );

  }



}
