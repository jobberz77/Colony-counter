import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { API_URL } from '../env';


@Injectable()
export class BackendService {

  constructor(private http: HttpClient) {
  }

  getImage(): Observable<string> {
    return this.http.get<string>(`${API_URL}/get_image`);
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return throwError(() => err.message || 'Error: Unable to complete request.');
  }
}