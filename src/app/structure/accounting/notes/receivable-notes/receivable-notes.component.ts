import { Component, Inject, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ReceivableNotesService } from './receivable-notes.service';
import { MessageService } from '../../../../message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppGlobals } from '../../../../app.globals';
import { Item } from './receivable-notes.item';

@Component({
    selector: 'app-page',
    templateUrl: './receivable-notes.component.html',
    styleUrls: ['./receivable-notes.component.css'],
    providers: [ReceivableNotesService],
    encapsulation: ViewEncapsulation.None
})
export class ReceivableNotesComponent implements OnInit {

    panelTitle: string;
    isLoadingProgress: boolean = false;
    rows: Item[];

    messages = this.globals.datatableMessages;
    rcvDate = this.globals.tDate;
    searchForm: FormGroup;

    constructor(
        @Inject(FormBuilder) fb: FormBuilder,
        private dataService: ReceivableNotesService,
        private globals: AppGlobals,
        private messageService: MessageService) {

        this.searchForm = fb.group({
            sch_year: ['', [Validators.required]],
            sch_month: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.panelTitle = '받을어음명세서';

        let ym = this.rcvDate.split('-');
        this.searchForm.controls['sch_year'].setValue(ym[0]);
        this.searchForm.controls['sch_month'].setValue(ym[1]);

        this.GetAll();
    }

    GetAll(): void {
        
        let formData = this.searchForm.value;
        let sch_year = formData.sch_year.trim();
        let sch_month = formData.sch_month.trim();

        if(!sch_year || !sch_month) {
            this.messageService.add('검색년월을 빠짐없이 입력하세요.');
            return;
        }

        let params = {
            sch_year: sch_year,
            sch_month: sch_month
        };

        this.isLoadingProgress = true;
        this.dataService.GetAll(params).subscribe(
            listData =>
            {
                this.rows = listData['data'];
                this.isLoadingProgress = false;
            }
        );

    }

    getRowClass(row) {
        let rt = '';
        if(row.is_all_sum_row == 'Y') {
            rt = 'all-row-color';
        }      
        return rt;
    }

}
