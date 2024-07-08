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
  predictedExpenses: number | null = null;

  constructor(private financialInsightsService: FinancialInsightsService) { }

  getPrediction() {
    if (this.month) {
      this.financialInsightsService.predictExpenses(this.month).subscribe(data => {
        this.predictedExpenses = data.predicted_expenses;
      });
    }
  }
}
