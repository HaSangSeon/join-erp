import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { SalaryService } from '../salary/salary.service';
import { MessageService } from '../../../../message.service';
import { AppGlobals } from '../../../../app.globals';
import { Item } from './pay-step.item';
import { PayStepService } from './pay-step.service';

@Component({
  selector: 'app-pay-step',
  templateUrl: './pay-step.component.html',
  styleUrls: ['./pay-step.component.scss']
})
export class PayStepComponent implements OnInit {

  inputForm: FormGroup;
  listData : Item[];
  rows = [];
  temp = [];


  panelTitle: string;
  inputFormTitle: string;
  errorMessage: string;
  ps_job_type: string;

  isExecutable: boolean = false;
  isEditMode: boolean = false;
  isLoadingProgress: boolean = false;

  messages = this.globals.datatableMessages;
  gridHeight = this.globals.gridHeight;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private messageService: MessageService,
    private globals: AppGlobals,
    private route: ActivatedRoute,
    private dataService: PayStepService
  ) {

    this.inputForm = fb.group({
      job_type: '',
      job_grade: '',
      sal_class: '',
      sal_amount: '',
    });

  }

  ngOnInit() {
    this.panelTitle = '호봉제정보'

    this.getAll()
  }

  getAll(): void {
    let params = {
    }
    this.isLoadingProgress = true;
    this.dataService.GetAll(params).subscribe(
      listData => {
        this.listData = listData;
        this.temp = listData['data'];
        this.rows = listData['data'];
        
        this.ps_job_type = listData['data'][0]['job_type'][0];

        //test
        console.log(this.ps_job_type);

        this.isLoadingProgress = false;
      }
    )
  }
}
