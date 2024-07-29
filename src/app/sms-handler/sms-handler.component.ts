import { Component, OnInit } from '@angular/core';
import { FinancialInsightsService } from '../financial-insights.service';
import { DashboardComponent } from '../budget-planner/dashboard/dashboard.component';


@Component({
  selector: 'app-sms-handler',
  templateUrl: './sms-handler.component.html',
  styleUrls: ['./sms-handler.component.scss']
})
export class SmsHandlerComponent implements OnInit {

  constructor(
    private financialInsightsService: FinancialInsightsService,
    private dashboard: DashboardComponent
  ) { }

  ngOnInit(): void {
    const exampleSmsBody = 'Your account has been credited with ₹1000';
    const examplePhoneNumber = '+1234567890';

    this.financialInsightsService.updateIncomeOrExpenseFromSMS(exampleSmsBody, examplePhoneNumber).subscribe(response => {
      console.log('SMS processed:', response);
      if (response.type === 'income') {
        this.dashboard.updateIncome(response.amount);
      } else if (response.type === 'expense') {
        this.dashboard.updateExpense(response.amount);
      }
    }, error => {
      console.error('Error processing SMS:', error);
    });
  }
}
