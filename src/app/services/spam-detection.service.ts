import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpamDetectionService {
  private apiUrl = 'http://localhost:5000/classify-email';  // Update if necessary

  constructor(private http: HttpClient) { }

  checkSpam(emailContent: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { content: emailContent });
  }
}
