import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Item } from './salary-calculation.item';
import { AppGlobals } from '../../../app.globals';


const httpOptions = {};
@Injectable({
  providedIn: 'root'
})
export class SalaryCalculationService {
  
  private url = this.globals.serverUrl + '/salary-calculation';

  constructor(
    private http: HttpClient,
    private globals: AppGlobals
  ) { }

  
  GetAll (params): Observable<Item[]> {
    return this.http.get<Item[]>(this.url, {params: params});
  }
  
  GetBenefit (params): Observable<Item[]> {
    return this.http.get<Item[]>(this.globals.serverUrl + '/salary/benefit', {params: params});
  }
  
  GetDeduction (params): Observable<Item[]> {
    return this.http.get<Item[]>(this.globals.serverUrl + '/salary/deduction', {params: params});
  }
  
  Save (data): Observable<Item> {
    return this.http.post<Item>(this.url + '/create', data, httpOptions).pipe(
        tap((data: Item) => this.log(`added data w/ id=${data}`)),
        catchError(this.handleError<Item>('Create'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(error);
        this.log(`${operation} failed: ${error.message}`);
        return of(result as T);
    };
  }

  private log(message: string) {
      console.log(message);
  }



}
