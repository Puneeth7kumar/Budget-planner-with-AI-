import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialInsightsService {
  private baseUrl = 'http://localhost:5000';  // Your Flask API base URL

  constructor(private http: HttpClient) { }

  predictExpenses(month: string, income: number, prevExpenses: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/predict`, { month, income, prevExpenses });
  }

  detectAnomalies(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/anomalies`);
  }

  getFinancialAdvice(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/advice`);
  }
}
