import { Injectable } from '@angular/core';
import { AppGlobals } from '../../../../app.globals';
import { Observable, of } from 'rxjs';
import { Item } from './pay-step.item';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

const httpOptions = {};

@Injectable({
  providedIn: 'root'
})
export class PayStepService {

  constructor(
    private http: HttpClient,
    private globals: AppGlobals
  ) { }

  private url = this.globals.serverUrl + '/pay-step';

  GetAll(params): Observable<Item[]> {
    return this.http.get<Item[]>(this.url, { params: params });
  }

  GetExcelFile(ym): Observable<Blob> {
    return this.http.get(this.url + '/exceldown/' + ym, { responseType: 'blob' }).pipe(
      tap((data: Blob) => console.log(data)),
      catchError(this.handleError<Blob>('Create'))
    );
  }

  UploadExcelFile (data) {
    return this.http.post(this.url + '/excelupload', data, httpOptions)
}

  /**
  * 실패한 Http 작업 처리
  * 프로그램은 계속 실행되도록 함.
  * @param operation - 실패한 작업명
  * @param result - observable 결과로 리턴할 선택적 값
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: 원격 로깅 인프라에 에러 전송
      console.error(error); // 대신 콘솔에 로그 출력

      // TODO: 오류 변환을 더 좋게 처리
      this.log(`${operation} failed: ${error.message}`);

      // 프로그램이 계속 실행되도록 빈 결과를 리턴
      return of(result as T);
    };
  }

  /** 오류 로그 */
  private log(message: string) {
    console.log(message);
    //this.messageService.add('오류: ' + message);
  }
}
