import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MessageService } from '../../../message.service';
import { AppGlobals } from '../../../app.globals';
import { ActivatedRoute } from '@angular/router';
import { Item } from './deduction.item';
import { DeductionService } from './deduction.service';

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

  listData: Item[];
  temp=[];
  rows=[];

  isExecutable: boolean = false;
  isEditMode: boolean = false;
  isLoadingProgress: boolean = false;

  messages = this.globals.datatableMessages;
  gridHeight = this.globals.gridHeight;

  addOkMsg = "등록이 안료되었습니다.";
  editOkMsg = "수정이 완료 되었습니다.";

  @ViewChild('InputFormModal') inputFormModal: ModalDirective;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private messageService: MessageService,
    private globals: AppGlobals,
    private route: ActivatedRoute,
    private dataService: DeductionService
  ) {


    this.inputForm = fb.group({
      deduction_code: ['', Validators.required],
      year: ['', Validators.required],
      acct_code: ['', Validators.required],
      calculation_method1: ['', Validators.required],
      calculation_method2: ['', Validators.required],
      calculation_method: '',
      entry_seq: ['', Validators.required],
      etc: ['', Validators.required],
      createdAt: '',
    });

  }

  ngOnInit() {
    this.panelTitle = '공제정보'
    this.inputFormTitle = "공제항목등록"
    this.getAll()
  }

  getAll(): void {
    let formData = this.inputForm.value;
    let params = {
    }
    this.isLoadingProgress = true;
    this.dataService.GetAll(params).subscribe(
      listData => {
        this.listData = listData;
        this.temp = listData['data'];
        this.rows = listData['data'];

        console.log("data:");
        console.log(this.temp['calculation_method']);
        this.isLoadingProgress = false;
      }
    )
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
    this.inputForm.value.calculation_method = this.inputForm.value.calculation_method1 + "," + this.inputForm.value.calculation_method2;
    let formData = this.inputForm.value;
    console.log("data:")
    console.log(formData.calculation_method)

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
            this.messageService.add(data['errorMessage']);
          }
          this.inputFormModal.hide();
        },
        error => this.errorMessage = <any>error

      )
  }

}
