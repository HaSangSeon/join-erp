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

        this.ps_job_type = listData['data'][0]['job_type'][0];

        this.isLoadingProgress = false;
      }
    )
  }

  openModal(method, id) {

    if (method == 'upload') {
      this.uploadFormModal.show();
    }

  }
  excelDown(): void {

    let ym = this.excelSchYear.nativeElement.value + "-" + this.excelSchMonth.nativeElement.value
    this.dataService.GetExcelFile(ym).subscribe(
      blob => {
        // Filesaver.js 1.3.8
        // 사용자가 지정한 저장위치를 읽을 수 있는 방법이 없어 저장된 파일의 링크를 제공할 수 없음.
        importedSaveAs(blob, "시산표.xlsx");

        let win = this.electronService.remote.getCurrentWindow();

        win.webContents.session.on('will-download', (event, item, webContents) => {

          const filename = item.getFilename();

          item.on('updated', (event, state) => {
            if (state === 'interrupted') {
              console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
              if (item.isPaused()) {
                console.log('Download is paused')
              } else {
                console.log(`Received bytes: ${item.getReceivedBytes()}`)
              }
            }
          })
          item.once('done', (event, state) => {
            if (state === 'completed') {
              console.log(filename + ' 저장 완료');
              this.uploadFormModal.hide();
            } else {
              alert('저장하려는 파일이 열려져 있습니다. 파일을 닫은 후 다시 진행해주세요');
              console.log(`Download failed: ${state}`)
            }
          })
        });
      },
      error => this.errorMessage = <any>error
    );
  }

  fileSelected () {
    let fileList: FileList = this.uploadFileSrc.nativeElement.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        //test
        console.log("cc");
        console.log(formData);

        this.excelUpload(formData);
    }
}

excelUpload (data): void {
    this.dataService.UploadExcelFile(data).subscribe(
        data => {
          //test
          console.log("dd");
          console.log(data);

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
