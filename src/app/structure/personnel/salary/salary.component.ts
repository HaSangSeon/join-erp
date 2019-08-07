import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../../../message.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppGlobals } from '../../../app.globals';
import { ActivatedRoute } from '@angular/router';
import { SalaryService } from './salary.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {
  inputForm: FormGroup;

  panelTitle: string;
  inputFormTitle: string;
  errorMessage: string;

  isExecutable: boolean = false;
  isEditMode: boolean = false;
  
  messages = this.globals.datatableMessages;

  addOkMsg = "등록이 안료되었습니다.";
  editOkMsg = "수정이 완료 되었습니다.";

  @ViewChild('InputFormModal') inputFormModal: ModalDirective;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private messageService: MessageService,
    private globals: AppGlobals,
    private route: ActivatedRoute,
    private dataService: SalaryService
  ) {

      this.inputForm = fb.group({
        sch_partner_name: '',
        sch_sdate: '',
        sch_edate: ''
      });

      this.inputForm = fb.group({
        benefit_code: '',
        year: '',
        benefit_name: '',
        order: '',
        tax_free_name: '',
        createdAt: '',
      });

  }

  ngOnInit() {
    this.panelTitle = '수당정보'
    this.inputFormTitle = "수당항목등록"
  }

  openModal(method, id) {

    if (method == 'write') {
      this.inputFormModal.show();
      console.log("in");
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

    if (!formData.benefit_code && !formData.year && !formData.benefit_name && !formData.order && !formData.tax_free_name) {
      alert('등록 정보를 확인하세요');
      return false;
    }else{
      this.Create(formData);
    }

  }

  Create(data): void{
    this.dataService.Create(data)
    .subscribe(
      data=>{
        console.log("data>>")
        console.log(data);

        if(data['result']=='success'){
          console.log(data['result']+"++")
          this.inputForm.reset();
          this.messageService.add(this.addOkMsg);
        }else{
          this.messageService.add(data['errorMessage'])
        }
        this.inputFormModal.hide();
      },
      error => this.errorMessage = <any>error
      
    )
  }
}