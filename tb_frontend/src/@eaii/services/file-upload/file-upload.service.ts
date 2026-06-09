import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private vbaseUrl = environment.vbaseUrl
  private baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }

  upload(file: File,creator:string,patient:string, ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('image_url', file);
    formData.append('creator', creator);
    formData.append('patient', patient);

    const req = new HttpRequest('POST', `${this.baseUrl}cxr-upload/`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(img_url:string): Observable<any> {
    return this.http.get(`${this.vbaseUrl}${img_url}`);
  }
}