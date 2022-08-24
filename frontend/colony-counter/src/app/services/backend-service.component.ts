import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { API_URL } from '../env';
import { CountResultModel } from '../entities/count-result.model';
import { DarkfieldSettingsModel } from '../entities/darkfield-settings.model'


@Injectable()
export class BackendService {

  constructor(private http: HttpClient) {
  }

  getPlateau() {
    this.http.get<any>(`${API_URL}/get_plateau`).subscribe();
  }

  shutdown() {
    this.http.get<any>(`${API_URL}/shutdown`).subscribe();
  }

  swallowContainerAndGetResultingImage(): Observable<CountResultModel> {
    return this.http.get<CountResultModel>(`${API_URL}/swallow_container_and_return_image`);
  }
  
  endCyclePrematurely() {
    this.http.get<any>(`${API_URL}/end_cycle_prematurely`).subscribe();
  }

  retakePhoto(qr_code: string): Observable<CountResultModel> {
    return this.http.get<any>(`${API_URL}/retake_photo?qr_code=` + qr_code);
  }

  saveImage(countResultModel: CountResultModel) {
    let request = this.http.post<any>(`${API_URL}/save_image`, 
    {
      "base64_image": countResultModel.base64_image,
      "count": countResultModel.count,
      "serialnumber": countResultModel.serialnumber 
    });

    request.subscribe();
  }

  saveDarkfieldSettings(red: number, green: number, blue: number, intensity: number){
    let request = this.http.post<any>(`${API_URL}/save_darkfield_settings`, 
    {
      'red': red,
      'green': green,
      'blue': blue,
      'intensity': intensity,
    });

    request.subscribe();
  }

  getDarkfieldSettings(): Observable<DarkfieldSettingsModel> {
    return this.http.get<DarkfieldSettingsModel>(`${API_URL}/get_darkfield_settings`);
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