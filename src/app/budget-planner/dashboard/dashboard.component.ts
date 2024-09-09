import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { FinancialInsightsService } from '../../financial-insights.service';
import { FinancialInsightsComponent } from '../../financial-insights/financial-insights.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FinancialCoachComponent } from '../../financial-coach/financial-coach.component';
import { FinancialCoachService } from '../../financial-coach.service';
import { BudgetPlannerModule } from '../budget-planner.module';
import { EmailService } from '../../email.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  // standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  //imports: [CommonModule, MatIconModule, SideNavComponent, FinancialInsightsComponent, HttpClientModule, FinancialCoachComponent]
})
export class DashboardComponent implements OnInit {
  lastMonthsIncome: { month: string, total: number }[] = [];
  currentMonthIncome: number = 0;


  lastMonthsExpense: { month: string, total: number }[] = [];
  currentMonthExpense: number = 0;
  lastMonthsLoans: { month: string, total: number }[] = [];
  currentMonthLoan: number = 0;

  currentMonthTodoTransactions: any[] = [];
  predictedExpenses: number | undefined;
  anomalies: string[] = [];
  financialAdvice: string | undefined;
  new_financial_advice: string | undefined;
  previousYearSavings: number = 50000;

  usedPreviousSavings: number = 0;
  latestIncome: number = 0;  // Initialize with 0
  latestExpense: number = 0;

  latestEmails: any[] = [];
  emailDetails: any[] = [];


  constructor(public router: Router, private FinancialCoachService: FinancialCoachService, private budgetService: BudgetService, private emailService: EmailService, private financialInsightsService: FinancialInsightsService, private http: HttpClient) { }

  ngOnInit() {
    this.latestIncome = 0;  // Initialize with 0
    this.latestExpense = 0;
    this.initializeDashboard();
    this.budgetService.income$.subscribe(() => this.updateCurrentMonthTotals());
    this.budgetService.expense$.subscribe(() => this.updateCurrentMonthTotals());
    this.budgetService.todoTransaction$.subscribe(() => this.updateCurrentMonthTodoTransactions());
    this.fetchEmails();

    // setInterval(() => this.fetchEmails(), 60000);
    this.budgetService.fetchLatestData();

    this.budgetService.latestIncome$.subscribe(income => {
      this.latestIncome = income || 0;
    });

    this.budgetService.latestExpense$.subscribe(expense => {
      this.latestExpense = expense || 0;  // Default to 0 if undefined
    });



    this.financialInsightsService.getIncomes().subscribe(data => {
      console.log('Incomes:', data);
    });

    this.financialInsightsService.getExpenses().subscribe(data => {
      console.log('Expenses:', data);
    });
  }
  // updateIncome(): void {
  //   this.income1 = this.budgetService.getTotalIncomeForMonth1(this.currentMonth1);
  // }

  initializeDashboard() {
    this.populateLastMonthsIncome();
    this.populateLastMonthsExpense();
    this.updateCurrentMonthTotals();
    //this.populateLastMonthsLoans();
    this.updateCurrentMonthTodoTransactions();
    this.getPredictedExpenses();
    this.detectAnomalies();
    this.getFinancialAdvice();
    this.getFinancialAdvice1();
  }
  fetchEmails() {
    this.emailService.fetchEmails().subscribe(
      (response) => {
        console.log('Fetched Emails:', response);

        if (response && Array.isArray(response.emails)) {
          this.latestEmails = response.emails;

          // Log each email's structure to inspect its content
          this.latestEmails.forEach(email => {
            console.log('Email Content:', email);
          });

          // Process the email content to extract financial information
          const { credited, debited, emailDetails } = this.emailService.processEmailContent(this.latestEmails);

          //Update income and expense totals
          if (credited > 0) {
            this.updateIncome(credited);
          }

          if (debited > 0) {
            this.updateExpense(debited);
          }

          // Display the email details with amounts on the dashboard
          this.displayEmailDetails(emailDetails);

        } else {
          console.error('Unexpected format: response.emails should be an array:', response);
        }
      },
      (error) => {
        console.error('Failed to fetch emails:', error);
      }
    );
  }

  // New method to display email details on the dashboard
  displayEmailDetails(emailDetails: any[]) {
    // Assume there's a component or method to handle displaying the email details
    // For example, setting this to a property that is used in the template
    this.emailDetails = emailDetails;
  }





  async populateLastMonthsIncome() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
    this.lastMonthsIncome = await Promise.all(
      months.map(async month => {
        const total = await this.budgetService.getTotalIncomeForMonth(month).toPromise();
        return { month, total: total || 0 };  // Handle undefined by defaulting to 0
      })
    );
  }

  async populateLastMonthsExpense() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
    this.lastMonthsExpense = await Promise.all(
      months.map(async month => {
        const total = await this.budgetService.getTotalExpenseForMonth(month).toPromise();
        return { month, total: total || 0 };
      })
    );
  }
  // populateLastMonthsLoans() {
  //   const months = ['January', 'February', 'March']; // Add more months as needed
  //   this.lastMonthsLoans = months.map(month => ({
  //     month,
  //     total: this.budgetService.getTotalLoanForMonth(month)
  //   }));
  // }

  updateCurrentMonthTotals() {
    const currentMonth = this.getCurrentMonth();
    this.budgetService.getTotalIncomeForMonth(currentMonth).subscribe(income => {
      this.currentMonthIncome = income || 0;  // Handle undefined by defaulting to 0
    });

    this.budgetService.getTotalExpenseForMonth(currentMonth).subscribe(expense => {
      this.currentMonthExpense = expense || 0;
    });
    const loans = this.budgetService.getLoansForMonth(currentMonth);
    this.currentMonthLoan = loans.reduce((total, loan) => total + loan.amount, 0);
  }

  updateCurrentMonthTodoTransactions() {
    const currentMonth = this.getCurrentMonth();
    this.currentMonthTodoTransactions = this.budgetService.getTodoTransactionsForMonth(currentMonth);
  }

  getPredictedExpenses() {
    const currentMonth = this.getCurrentMonth();
    const income = this.currentMonthIncome;

    // Subscribe to get the previous month's expenses
    this.getPreviousMonthExpense().subscribe(prevExpenses => {
      // Once previous expenses are available, call the prediction service
      this.financialInsightsService.predictExpenses(currentMonth, income, prevExpenses).subscribe(data => {
        this.predictedExpenses = data.predicted_expenses_rf;  // or predicted_expenses_arima
      });
    });
  }


  getPreviousMonthExpense(): Observable<number> {
    const previousMonth = this.getPreviousMonth();
    return this.budgetService.getTotalExpenseForMonth(previousMonth);
  }

  getPreviousMonth(): string {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    return currentDate.toLocaleString('default', { month: 'long' });
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
  getFinancialAdvice1() {
    this.FinancialCoachService.getFinancialAdvice1().subscribe(data => {
      this.new_financial_advice = data.advice;
    });
  }

  get totalCurrentMonthIncome(): number {
    return this.currentMonthIncome;
  }

  get totalCurrentMonthExpense(): number {
    return this.currentMonthExpense;
  }
  get totalCurrentMonthLoan(): number {
    return this.currentMonthLoan;
  }

  // get currentMonthSavings(): number {
  //   return this.totalCurrentMonthIncome - this.totalCurrentMonthExpense;
  // }
  get currentMonthSavings(): number {
    const savings = this.totalCurrentMonthIncome - this.totalCurrentMonthExpense;

    if (savings < 0 && this.previousYearSavings > 0) {
      this.usedPreviousSavings = Math.abs(savings) > this.previousYearSavings ? this.previousYearSavings : Math.abs(savings);
      return this.previousYearSavings - this.usedPreviousSavings;
    } else {
      this.usedPreviousSavings = 0;
    }

    return savings;
  }


  getCurrentMonth(): string {
    const currentDate = new Date();
    return currentDate.toLocaleString('default', { month: 'long' });
  }

  onIncome() {
    this.router.navigate(['/budget-planner/income']);
  }

  onExpense() {
    this.router.navigate(['/budget-planner/expense']);
  }

  onTodo() {
    this.router.navigate(['/budget-planner/todo']);
  }
  onLoan() {
    this.router.navigate(['/budget-planner/loan']);
  }
  updateIncome(amount: number) {
    this.latestIncome += amount;
    this.currentMonthIncome += amount;
    this.updateCurrentMonthTotals();
  }

  updateExpense(amount: number) {
    this.latestExpense += amount;
    this.currentMonthExpense += amount;
    this.updateCurrentMonthTotals();
  }

}
