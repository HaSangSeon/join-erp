import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppGlobals } from '../../../../app.globals';
import { Observable } from 'rxjs';
import { Item } from './employee.item';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private globals: AppGlobals
  ) { }
  
  private url = this.globals.serverUrl + '/users';

  GetAll(params): Observable<Item[]> {
    return this.http.get<Item[]>(this.url, { params: params });
  }
}
