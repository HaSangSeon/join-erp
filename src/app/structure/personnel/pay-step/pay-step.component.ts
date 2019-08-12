import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from '../../../message.service';
import { AppGlobals } from '../../../app.globals';
import { ActivatedRoute } from '@angular/router';
import { SalaryService } from '../salary/salary.service';

@Component({
  selector: 'app-pay-step',
  templateUrl: './pay-step.component.html',
  styleUrls: ['./pay-step.component.scss']
})
export class PayStepComponent implements OnInit {

  loadForm: FormGroup;

  panelTitle: string;
  inputFormTitle: string;
  errorMessage: string;

  isExecutable: boolean = false;
  isEditMode: boolean = false;

  rows=[];

  messages = this.globals.datatableMessages;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private messageService: MessageService,
    private globals: AppGlobals,
    private route: ActivatedRoute,
    private dataService: SalaryService
  ) {

    this.loadForm = fb.group({
      job_type: '',
      job_grade: '',
      sal_class: '',
      sal_amount: '',
    });

  }

  ngOnInit() {
    this.panelTitle = '호봉제정보'
  }

}
