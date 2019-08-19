import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from '../../../message.service';
import { AppGlobals } from '../../../app.globals';
import { SalaryCalculationService } from './salary-calculation.service';

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
  errorMessage: string;

  year: string;
  month: string;
  userId: string;
  userName: string;

  d_object=[];
  m_object=[];
  bonus_no=[];

  rows = [];
  benefitRows = [];
  deductionRows = [];
  
  messages = this.globals.datatableMessages;
  gridHeight = this.globals.gridHeight;

  addOkMsg = "등록이 안료되었습니다.";
  editOkMsg = "수정이 완료 되었습니다.";

  isExecutable: boolean = false;
  isLoadingProgress: boolean = false;

  @ViewChild('InputFormModal') inputFormModal: ModalDirective;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private messageService: MessageService,
    private globals: AppGlobals,
    private dataService: SalaryCalculationService
  ) 
  {

    this.inputForm = fb.group({
      year: ['2019', Validators.required]
    });

    this.searchForm = fb.group({
        year: [''],
        month: [''],
        pay_num: [''],
        pay_type: ['']
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
    
    this.getAll();

  }

  getAll() {

    //검색 데이터 - 지급연월등록
    let formData = this.searchForm.value;
    let params = {
    }
    this.isLoadingProgress = true;
    this.dataService.GetAll(params).subscribe(
      listData => {
        this.rows = listData['data'];
        
        this.isLoadingProgress = false;
      }
    );

  }


  Save() {
    let formData = this.inputForm.value;
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


  openModal(method, value) {
    this.userId = value.user_id;
    this.userName = value.user_name;
    this.inputFormModal.show();

    //수당 및 공제데이터
    let formData = this.searchForm.value;
    let params = {
      year : "2019"
    }

    this.dataService.GetBenefit(params).subscribe(
      listData => {
        this.benefitRows = listData['data'];
        for(var i in listData['data']) {
          let code = listData['data'][i]['benefit_code'];     
          this.inputForm.addControl(code, new FormControl(''));
        }
      }
    );
    
    this.dataService.GetDeduction(params).subscribe(
      listData => {
        this.deductionRows = listData['data'];  
        for(var i in listData['data']) {
          let code = listData['data'][i]['deduction_code'];     
          this.inputForm.addControl(code, new FormControl(''));
        }      
      }
    );
    

  }



}
