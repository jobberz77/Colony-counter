import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { API_URL } from '../env';
import { CountResultModel } from '../entities/count-result.model';


@Injectable()
export class BackendService {

  constructor(private http: HttpClient) {
  }

  getImage(): Observable<CountResultModel> {
    return this.http.get<CountResultModel>(`${API_URL}/get_image`);
  }

  swallowContainerAndGetResultingImage(): Observable<CountResultModel> {
    return this.http.get<CountResultModel>(`${API_URL}/swallow_container_and_return_image`);
  }
  
  endCyclePrematurely() {
    this.http.get<any>(`${API_URL}/end_cycle_prematurely`).subscribe();
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

  getPlaceholderImage(): Observable<string> {
    return this.http.get('../../assets/images/placeholder_image_base64.txt', {responseType: 'text'});
  }
  
  getLoadingImage(): Observable<string> {
    return this.http.get('../../assets/images/loading_image_base64.txt', {responseType: 'text'});
  }

  private static _handleError(err: HttpErrorResponse | any) {
    return throwError(() => err.message || 'Error: Unable to complete request.');
  }
}