import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from '../../../message.service';
import { AppGlobals } from '../../../app.globals';

@Component({
  selector: 'app-salary-calculation',
  templateUrl: './salary-calculation.component.html',
  styleUrls: ['./salary-calculation.component.scss']
})
export class SalaryCalculationComponent implements OnInit {
  panelTitle: string;
  inputFormTitle: string;

  searchForm: FormGroup;
  inputForm: FormGroup;

  d_object=[];
  m_object=[];
  bonus_no=[];
  rows=[];
  
  messages = this.globals.datatableMessages;
  gridHeight = this.globals.gridHeight;

  isExecutable: boolean = false;
  isLoadingProgress: boolean = false;

  @ViewChild('InputFormModal') inputFormModal: ModalDirective;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private messageService: MessageService,
    private globals: AppGlobals,
  ) {

    this.inputForm = fb.group({
      heat_treatment_process: '',
      heat_treatment_criteria: '',
      product_code: '',
      product_name: '',
      drawing_no: '',
      material: '',
      production_line: '',
      brief_summary:'',
  });

    this.searchForm = fb.group({
      forging_id: ['',],
      order_date: ['',],
      rcv_req_date: ['',],
      poc_no: ['',],
      order_qty: ['',],
      partner_name: ['',],
      partner_code: ['',],
      heat_treatment_process: '',
      heat_treatment_criteria: '',
      product_code: '',
      product_name: '',
      drawing_no: '',
      material: ''
  });

  for(var i=1; i<=12; i++){
    this.m_object.push(i);
  }
  for(var i=1; i<=31; i++ ){
    this.d_object.push(i)
  }
  for(var i=1; i<=9; i++){
    this.bonus_no.push(i);
  }


   }

  ngOnInit() {
    this.panelTitle='급여정보'
    this.inputFormTitle = '급여계산';
  

  }

  openModal(method) {
    // 실행권한
    // if (this.isExecutable == true) {
        if (method == 'write') {
            this.inputFormModal.show();
        }
    // } else {
        // alert(this.globals.isNotExecutable);
        // return false;
    // }

  }
}
