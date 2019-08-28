import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from '../../../message.service';
import { AppGlobals } from '../../../app.globals';
import { SalaryCalculationService } from './salary-calculation.service';
import { pbV, P } from '@angular/core/src/render3';
import { flatMap } from 'rxjs/operators';
import { when } from 'q';
import { Observable, forkJoin } from 'rxjs';


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

  refId: string;
  year: string;
  month: string;
  userId: string;
  userName: string;

  colArray = [];
  arrYear = [];
  arrMonth = [];
  tmpYm = [];

  rows = [];
  paymentYmRows = [];
  benefitRows = [];
  deductionRows = [];

  
  rcvDate = this.globals.tDate;
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

    this.searchForm = fb.group({
        year: [this.rcvDate.split('-')[0], Validators.required],
        month: [this.rcvDate.split('-')[1], Validators.required],
        pay_num: [1, Validators.required],
        pay_type: [10, Validators.required]
    });

    this.inputForm = fb.group({
      year: '',
      month: '',
      user_id: ''
    });

  }

  ngOnInit() {
    this.panelTitle='급여정보'
    this.inputFormTitle = '급여계산';
   
    
    let tmpYear = [];

    //급여연월등록 검색
    this.dataService.GetPaymentYm().subscribe(
      listData => {
        this.paymentYmRows = listData['data'];
        
        this.arrYear = [];
        for(let i in listData['data']) {          
          if(tmpYear.indexOf(listData['data'][i]['year']) < 0) {
            this.arrYear.push(listData['data'][i]['year']);
          }
          tmpYear.push(listData['data'][i]['year']);
          this.tmpYm.push(listData['data'][i]['year'] + '::' + listData['data'][i]['month']);
        }

      }
    );


  }

  changeYear() {
    let schForm = this.searchForm;
    schForm.patchValue({month:'', pay_num:'', pay_type:''});
    schForm.controls['month'].enable();
    schForm.controls['pay_num'].disable();
    schForm.controls['pay_type'].disable();

    this.arrMonth = [];
    for(let i in this.paymentYmRows) {          
      if(this.tmpYm.indexOf(schForm.value.year + '::' + this.paymentYmRows[i]['month']) >= 0) {
        this.paymentYmRows[i]['month'] = this.paymentYmRows[i]['month'] < 10 ? '0' + this.paymentYmRows[i]['month'] : this.paymentYmRows[i]['month'];
        this.arrMonth.push(this.paymentYmRows[i]['month']);
      }
    }

  }

  changeMonth() {
    let schForm = this.searchForm;
    schForm.patchValue({pay_num:'', pay_type:''});
    schForm.controls['pay_num'].enable();
    schForm.controls['pay_type'].disable();
  }

  changePayNum() {
    let schForm = this.searchForm;
    schForm.patchValue({pay_type:''});
    schForm.controls['pay_type'].enable();
  }

  getAll() {
    
    let schFormData = this.searchForm.value;    

    let prm = {
      year : schFormData.year
    }
    this.dataService.GetBenefit(prm).subscribe(
      listData => {
        this.benefitRows = listData['data'];
        for(var i in listData['data']) {
          let code = listData['data'][i]['benefit_code'];     
          this.inputForm.addControl('id_'+code+'_benefit', new FormControl(''));
        }
      }
    );
    
    this.dataService.GetDeduction(prm).subscribe(
      listData => {
        this.deductionRows = listData['data'];  
        for(var i in listData['data']) {
          let code = listData['data'][i]['deduction_code'];     
          this.inputForm.addControl('id_'+code+'_deduction', new FormControl(''));
        }      
      }
    );

    setTimeout(() => {

      this.rows = [];  
      this.colArray = [];

      let prm = {
        ref_id: this.refId
      }
      this.isLoadingProgress = true;
      this.dataService.GetAll(prm).subscribe(
        listData => {
        
          this.isLoadingProgress = false;
          
          let tm = [];
          for(let p in listData['data']) {
            let d = p.split('-');
            let year = d[0];
            let month = d[1];
            let user_id = d[2];
            let item_type = d[3];
            let item_code = d[4];

            tm.push({year:year, month:month, user_id:user_id, item_type:item_type, item_code:item_code, item_amount:listData['data'][p]});
          }
          
          let userArray = [];
          for(let p in listData['data']) {
            let d = p.split('-');
            let year = d[0];
            let month = d[1];
            let user_id = d[2];
            let item_type = d[3];
            let item_code = d[4];

            let ob :any = {
              'year': year,
              'month': month,
              'user_id': user_id,   
              'item_type': item_type,
              'item_code': item_code       
            };

            if (userArray.indexOf(user_id) < 0) {    

              this.colArray = [];            
              for(let i in this.benefitRows) { 
                let tmp_amount = 0;
                for(let ii in tm) {
                  if(tm[ii]['year'] == year && tm[ii]['month'] == month && tm[ii]['user_id'] == user_id && tm[ii]['item_type'] == 'P' && tm[ii]['item_code'] == this.benefitRows[i]['benefit_code']) {
                      tmp_amount = tm[ii]['item_amount'];
                  }
                }
                this.colArray.push(tmp_amount);                         
              }      
    
              for(let i in this.deductionRows) { 
                let tmp_amount = 0;
                for(let ii in tm) {
                  if(tm[ii]['year'] == year && tm[ii]['month'] == month && tm[ii]['user_id'] == user_id && tm[ii]['item_type'] == 'D' && tm[ii]['item_code'] == this.deductionRows[i]['deduction_code']) {
                      tmp_amount = tm[ii]['item_amount'];
                  }
                }
                this.colArray.push(tmp_amount);                           
              }     

              ob.data = this.colArray;
              this.rows.push(ob);
              this.rows.sort( (a,b) =>  a.user_id < b.user_id ? -1 : a.user_id > b.user_id ? 1 : 0 );
            }

            userArray.push(user_id);
          }

          //검색을 했을경우 refId 생성
          this.refId = schFormData.year + "-" + schFormData.month + "-" + schFormData.pay_num + "-" + schFormData.pay_type;

        }
      );

    }, 100);
    


  }



  Save() {

    if(!this.year || !this.month || !this.userId || !this.refId) {
      this.messageService.add("잘못된 접근입니다.");
      return false;
    }

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
      ref_id: this.refId,
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


  openModal(method, obj) {
    
    let schFormData = this.searchForm.value;

    this.year = schFormData.year;
    this.month = schFormData.month;

    this.userId = obj.user_id;
    this.userName = obj.user_name;

    this.inputFormModal.show();


  }



}
