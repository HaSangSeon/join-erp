import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { SalaryService } from './salary.service';
import { Item } from './salary.item';
import { MessageService } from '../../../../message.service';
import { AppGlobals } from '../../../../app.globals';
import { ConfigService } from '../../../../config.service';

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
  selectedId: string;

  isExecutable: boolean = false;
  isEditMode: boolean = false;
  isLoadingProgress: boolean = false;

  rows = [];
  temp = [];
  selected = [];
  listData: Item[];
  editData: Item;
  formData: Item['data'];

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
    private dataService: SalaryService,
    private configService: ConfigService
  ) {

    this.inputForm = fb.group({
      benefit_code: ['', Validators.required],
      year: ['', Validators.required],
      benefit_name: ['', Validators.required],
      entry_seq: ['', Validators.required],
      tax_free_name: ['', Validators.required],
      createdAt: '',
    });

  }

  ngOnInit() {
    this.panelTitle = '수당정보'
    this.inputFormTitle = "수당항목등록"
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
        this.isLoadingProgress = false;
      }
    )
  }

  openModal(method, id) {

    if (method == 'write') {
      this.inputFormModal.show();
    }
    if (id) {
      if (id == 'selected') {
        let idArr = [];
        this.selected.forEach((e: any) => {
          idArr.push(e.id);
        });
        this.selectedId = idArr.join(',');
      } else {
        this.selectedId = id;
      }
    }
    if (method == 'write') {
      if (id) {
        this.isEditMode = true;
        this.Edit(id);
      } else {
        this.inputForm.reset();
        this.isEditMode = false;
      }
    }

  }

  Save() {
    let formData = this.inputForm.value;

    if (this.isEditMode == true) {
      this.Update(this.selectedId, formData);
    } else {
      formData.st = '1';
      this.Create(formData);
    }

  }

  Update(id, data): void {
    this.dataService.Update(id, data)
      .subscribe(
        data => {
          if (data['result'] == "success") {
            this.inputForm.reset();
            this.getAll();
            this.messageService.add(this.editOkMsg);
          } else {
            this.messageService.add(data['errorMessage']);
          }
          this.inputFormModal.hide();
        },
        error => this.errorMessage = <any>error
      );
  }

  Create(data): void {
    this.dataService.Create(data)
      .subscribe(
        data => {

          if (data['result'] == 'success') {
            this.inputForm.reset();
            this.configService.load();
            this.getAll();
            this.messageService.add(this.addOkMsg);
          } else {
            this.messageService.add(data['errorMessage'])
          }
          this.inputFormModal.hide();
        },
        error => this.errorMessage = <any>error

      )
  }

  Edit(id) {
    this.dataService.GetById(id).subscribe(
      editData => {
        if (editData['result'] == "success") {
          this.editData = editData;
          this.formData = editData['data'];
          this.inputForm.patchValue({
            benefit_code: this.formData.benefit_code,
            year: this.formData.year,
            benefit_name: this.formData.benefit_name,
            entry_seq: this.formData.entry_seq,
            tax_free_name: this.formData.tax_free_name,
          });
        }
      }
    );
  }
}
