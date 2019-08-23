import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from '../../../../message.service';
import { AppGlobals } from '../../../../app.globals';
import { EmployeeService } from './employeel.service';
import { Item } from './employee.item';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  panelTitle: string;
  day: string;
  
  inputFormTitle: string;
  searchForm: FormGroup;
  inputForm: FormGroup;
  
  rows = [];
  temp = [];
  listData: Item[];

  messages = this.globals.datatableMessages;
  gridHeight = this.globals.gridHeight;

  isExecutable: boolean = false;
  isLoadingProgress: boolean = false;

  @ViewChild('InputFormModal') inputFormModal: ModalDirective;


  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private messageService: MessageService,
    private globals: AppGlobals,
    private dataService: EmployeeService
  ) {
    
    this.inputForm = fb.group({
      id: ['', Validators.required],
      user_id: ['', Validators.required],
      user_pw: ['', Validators.required],
      user_name: ['', Validators.required],
      dept_name: ['', Validators.required],
      position_name: ['', Validators.required],
      user_email: ['', Validators.required],
      user_phone: ['', Validators.required],
      user_addr: ['', Validators.required],
      joining_date: ['', Validators.required],
      createdAt: ['', Validators.required],
      updatedAt: ['', Validators.required],
    });

    this.searchForm = fb.group({
      user_id: ['',],
      user_name: ['',],
      dept_name: ['',],
    });

  }

  ngOnInit() {
    this.panelTitle = '사원정보'
    this.inputFormTitle = '사원등록';
    this.getAll();

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

  getAll(): void {
    let listData = this.inputForm.value;
    this.isLoadingProgress = true;
    let params={
    }
    this.dataService.GetAll(params).subscribe(
      listData => {
        this.listData = listData;
        this.temp = listData['data'];
        this.rows = listData['data'];

        this.isLoadingProgress = false;
      }
    )
  }

}
