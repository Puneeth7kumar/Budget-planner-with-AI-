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
  updateIncomeOrExpenseFromSMS(message: string, phoneNumber: string): Observable<any> {
    const smsData = { Body: message, From: phoneNumber };
    return this.http.post(`${this.baseUrl}/sms`, smsData);
  }
  getIncomes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/incomes`);
  }

  getExpenses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/expenses`);
  }
}
