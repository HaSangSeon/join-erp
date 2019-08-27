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

  year: string;
  month: string;
  userId: string;
  userName: string;

  colArray = [];
  arr_month = [];
  arr_pay_type = [];

  rows = [];
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

    for(var i=1; i<=12; i++) {
      let s = i < 10 ? '0'+i : i;
      this.arr_month.push(s);
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
      let prm2 = {
        year : schFormData.year,
        month : schFormData.month
      }
      this.isLoadingProgress = true;
      this.dataService.GetAll(prm2).subscribe(
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

            console.log(d);
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

        }
      );

    }, 100);
    

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


  openModal(method, obj) {

    this.userId = obj.user_id;
    this.userName = obj.user_name;

    let schFormData = this.searchForm.value;
    this.inputForm.patchValue({year:schFormData.year, month:schFormData.month, user_id:obj.user_id});


    this.inputFormModal.show();


  }



}
