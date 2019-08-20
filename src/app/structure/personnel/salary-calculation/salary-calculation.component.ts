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

  arr_month = [];
  arr_pay_type = [];

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
      year: '',
      month: ''
    });

    this.searchForm = fb.group({
        year: [''],
        month: [''],
        pay_num: [''],
        pay_type: ['']
    });

    for(var i=1; i<=12; i++) {
      this.arr_month.push(i);
    }
    for(var i=1; i<=9; i++) {
      this.arr_pay_type.push(i);
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

    let rowData = [];
    for(var i in this.benefitRows) {
      let colData = [];
      colData.push( this.benefitRows[i]['benefit_code'] ); 
      colData.push('P');      
      colData.push( formData['id_'+this.benefitRows[i]['benefit_code']+'_benefit'] );
      rowData.push(colData.join(':#:'));
    }
    
    for(var i in this.deductionRows) {
      let colData = [];
      colData.push( this.deductionRows[i]['deduction_code'] ); 
      colData.push('D');      
      colData.push( formData['id_'+this.deductionRows[i]['deduction_code']+'_deduction'] );
      rowData.push(colData.join(':#:'));
    }


    const saveData = {
        year: this.year,
        month: this.month,
        user_id: this.userId,
        pattern_data: rowData.join('=||=')
    }

    this.dataService.Save(saveData)
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
          this.inputForm.addControl('id_'+code+'_benefit', new FormControl(''));
        }
      }
    );
    
    this.dataService.GetDeduction(params).subscribe(
      listData => {
        this.deductionRows = listData['data'];  
        for(var i in listData['data']) {
          let code = listData['data'][i]['deduction_code'];     
          this.inputForm.addControl('id_'+code+'_deduction', new FormControl(''));
        }      
      }
    );
    

  }



}
