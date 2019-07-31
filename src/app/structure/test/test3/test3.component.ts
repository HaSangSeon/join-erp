import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../../../message.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-test3',
  templateUrl: './test3.component.html',
  styleUrls: ['./test3.component.scss']
})
export class Test3Component implements OnInit {
  inputForm: FormGroup;
  panelTitle: string;
  inputFormTitle: string;

  @ViewChild('InputFormModal') inputFormModal: ModalDirective;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private messageService: MessageService
  ) {

    this.inputForm = fb.group({
      sch_partner_name: '',
      sch_sdate: '',
      sch_edate: ''
  });

   }

  ngOnInit() {
    this.panelTitle='수당정보'
    this.inputFormTitle="수당항목등록"
  }

  openModal(method) {
    // 실행권한
    // if (this.isExecutable == true) {
        if (method == 'write') {
            this.inputFormModal.show();
            console.log("in");
        }
    // } else {
        // alert(this.globals.isNotExecutable);
        // return false;
    // }

}
}
