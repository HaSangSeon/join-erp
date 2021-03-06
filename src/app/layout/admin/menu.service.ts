import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { NavItem } from './navitem';

@Injectable()
export class MenuService {

    private navItemUrl = 'http://seil-erp.innest.co.kr/loadNavItems?format=json';  // URL to web api

    constructor(private http: HttpClient) { }

    /** GET heroes from the server */
    loadNavItems (): Observable<NavItem[]> {
        return this.http.jsonp<NavItem[]>(this.navItemUrl, 'callback');
    }

   /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            //this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
