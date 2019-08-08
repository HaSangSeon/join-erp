import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from '../../../message.service';
import { AppGlobals } from '../../../app.globals';
import { ActivatedRoute } from '@angular/router';
import { SalaryService } from '../salary/salary.service';

@Component({
  selector: 'app-deduction',
  templateUrl: './deduction.component.html',
  styleUrls: ['./deduction.component.scss']
})
export class DeductionComponent implements OnInit {

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
      benefit_code: ['', Validators.required],
      year: ['', Validators.required],
      benefit_name: ['', Validators.required],
      order: ['', Validators.required],
      tax_free_name: ['', Validators.required],
      createdAt: '',
      // 임시
      none:''
    });

  }

  ngOnInit() {
    this.panelTitle = '공제정보'
    this.inputFormTitle = "공제항목등록"
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

    this.Create(formData);

  }

  Create(data): void {
    this.dataService.Create(data)
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

      )
  }

}
