import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialInsightsService {
  private apiUrl = 'http://127.0.0.1:5000/predict';

  constructor(private http: HttpClient) { }

  predictExpenses(month: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { month });
  }
}
