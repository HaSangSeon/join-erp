import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Item } from './receivable-notes.item';
import { AppGlobals } from '../../../../app.globals';

@Injectable()
export class ReceivableNotesService {
   
    private url = this.globals.serverUrl + '/notes/receivable';

    constructor(
        private http: HttpClient,
        private globals: AppGlobals) { }


    GetAll (params): Observable<Item[]> {
        return this.http.get<Item[]>(this.url, {params: params});
    }

}
