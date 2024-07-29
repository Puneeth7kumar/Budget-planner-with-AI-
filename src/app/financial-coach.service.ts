import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialCoachService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  getFinancialAdvice1(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/advice`);
  }
  getVoiceCommand(audioBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice_command.wav');
    return this.http.post<any>(`${this.apiUrl}/voice_command`, formData);
  }

}
