import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
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
  listData: Item[];
  rows = [];
  temp = [];


  panelTitle: string;
  inputFormTitle: string;
  uploadFormTitle: string;
  errorMessage: string;
  ps_job_type: string;
  upLoadOkMsg = '등록이 완료되었습니다.';

  isExecutable: boolean = false;
  isEditMode: boolean = false;
  isLoadingProgress: boolean = false;

  messages = this.globals.datatableMessages;
  gridHeight = this.globals.gridHeight;

  @ViewChild('UploadFormModal') uploadFormModal: ModalDirective;
  @ViewChild('uploadFileSrc') uploadFileSrc: ElementRef;

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
    this.uploadFormTitle = "호봉제 엑셀업로드"

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

        if(this.ps_job_type!=""){
          this.ps_job_type = listData['data'][0]['job_type'][0];
        }

        this.isLoadingProgress = false;
      }
    )
  }

  openModal(method, id) {

    if (method == 'upload') {
      this.uploadFormModal.show();
    }

  }

  fileSelected () {
    let fileList: FileList = this.uploadFileSrc.nativeElement.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);

        this.excelUpload(formData);
    }
}

excelUpload (data): void {
    this.dataService.UploadExcelFile(data).subscribe(
        data => {

            if (data['result'] == "success") {
                this.inputForm.reset();
                this.getAll();
                this.messageService.add(this.upLoadOkMsg);
            } else {
                this.messageService.add(data['errorMessage']);
            }
            this.uploadFormModal.hide();
        },
        error => this.errorMessage = <any>error
    );
}

}
