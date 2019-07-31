import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from '../../../message.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppGlobals } from '../../../app.globals';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.scss']
})
export class Test1Component implements OnInit {
  panelTitle: string;
  inputFormTitle: string;
  searchForm: FormGroup;
  inputForm: FormGroup;
  
  messages = this.globals.datatableMessages;

  isExecutable: boolean = false;

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

   }

  ngOnInit() {
    this.panelTitle='사원정보'
    this.inputFormTitle = '사원등록';
  

  }

  openModal(method) {
    // 실행권한
    // if (this.isExecutable == true) {
        if (method == 'write') {
            this.inputFormModal.show();
            console.log("in");
        }
    // } else {
        // alert(this.globals.isNotExecutable);
        // return false;
    // }

  }

}
