import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from '../../../message.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppGlobals } from '../../../app.globals';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  searchForm: FormGroup;
  inputForm: FormGroup;
  panelTitle: string;
  inputFormTitle: string;

  rows=[];

  messages = this.globals.datatableMessages;

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
      material: ''
  });

    this.searchForm = fb.group({
      sch_partner_name: '',
      sch_sdate: '',
      sch_edate: ''
  });

   }

  ngOnInit() {
    this.panelTitle='부서정보'
    this.inputFormTitle="부서등록"

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
