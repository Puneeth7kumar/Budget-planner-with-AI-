import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FinancialInsightsService } from '../financial-insights.service';

@Component({
  selector: 'app-financial-insights',
  templateUrl: './financial-insights.component.html',
  styleUrls: ['./financial-insights.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class FinancialInsightsComponent {
  month: string = '';
  income: number | null = null;
  prevExpenses: number | null = null;
  predictedExpensesRF: number | null = null;
  predictedExpensesARIMA: number | null = null;
  anomalies: string[] = [];
  financialAdvice: string | null = null;

  constructor(private financialInsightsService: FinancialInsightsService) { }

  getPrediction() {
    if (this.month && this.income !== null && this.prevExpenses !== null) {
      this.financialInsightsService.predictExpenses(this.month, this.income, this.prevExpenses).subscribe(data => {
        this.predictedExpensesRF = data.predicted_expenses_rf;
        this.predictedExpensesARIMA = data.predicted_expenses_arima;
      });
    }
  }

  detectAnomalies() {
    this.financialInsightsService.detectAnomalies().subscribe(data => {
      this.anomalies = data.anomalies;
    });
  }

  getFinancialAdvice() {
    this.financialInsightsService.getFinancialAdvice().subscribe(data => {
      this.financialAdvice = data.advice;
    });
  }
}
