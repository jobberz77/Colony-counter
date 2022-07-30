import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { count, Observable, throwError } from 'rxjs';
import { API_URL } from '../env';
import { CountResultModel } from '../entities/count-result.model';


@Injectable()
export class BackendService {

  constructor(private http: HttpClient) {
  }

  getImage(): Observable<CountResultModel> {
    return this.http.get<CountResultModel>(`${API_URL}/get_image`);
  }

  saveImage(countResultModel: CountResultModel) {
    let request = this.http.post<any>(`${API_URL}/save_image`, 
    {
      "base64_image": countResultModel.base64_image,
      "count": countResultModel.count,
      "serialnumber": countResultModel.serialnumber
    });

    request.subscribe((data) => {
      console.log(data)
    });
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return throwError(() => err.message || 'Error: Unable to complete request.');
  }
}