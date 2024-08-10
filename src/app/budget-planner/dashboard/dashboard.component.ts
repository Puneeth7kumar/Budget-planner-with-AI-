import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { FinancialInsightsService } from '../../financial-insights.service';
import { FinancialInsightsComponent } from '../../financial-insights/financial-insights.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FinancialCoachComponent } from '../../financial-coach/financial-coach.component';
import { FinancialCoachService } from '../../financial-coach.service';
import { BudgetPlannerModule } from '../budget-planner.module';

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
  latestIncome: number | undefined;
  latestExpense: number | undefined;
  //new adding here
  // income1: number = 0;
  // expenses1: number = 0;
  // currentMonth1: string = 'July';

  constructor(public router: Router, private FinancialCoachService: FinancialCoachService, private budgetService: BudgetService, private financialInsightsService: FinancialInsightsService, private http: HttpClient) { }

  ngOnInit() {
    this.initializeDashboard();
    this.budgetService.income$.subscribe(() => this.updateCurrentMonthTotals());
    this.budgetService.expense$.subscribe(() => this.updateCurrentMonthTotals());
    this.budgetService.todoTransaction$.subscribe(() => this.updateCurrentMonthTodoTransactions());


    this.budgetService.latestIncome$.subscribe(income => {
      this.latestIncome = income;
    });

    this.budgetService.latestExpense$.subscribe(expense => {
      this.latestExpense = expense;
    });

    this.budgetService.fetchLatestData();

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
    this.populateLastMonthsLoans();
    this.updateCurrentMonthTodoTransactions();
    this.getPredictedExpenses();
    this.detectAnomalies();
    this.getFinancialAdvice();
    this.getFinancialAdvice1();
  }

  populateLastMonthsIncome() {
    const months = ['January', 'February', 'March']; // Add more months as needed
    this.lastMonthsIncome = months.map(month => ({
      month,
      total: this.budgetService.getTotalIncomeForMonth(month)
    }));
  }

  populateLastMonthsExpense() {
    const months = ['January', 'February', 'March']; // Add more months as needed
    this.lastMonthsExpense = months.map(month => ({
      month,
      total: this.budgetService.getTotalExpenseForMonth(month)
    }));
  }
  populateLastMonthsLoans() {
    const months = ['January', 'February', 'March']; // Add more months as needed
    this.lastMonthsLoans = months.map(month => ({
      month,
      total: this.budgetService.getTotalLoanForMonth(month)
    }));
  }

  updateCurrentMonthTotals() {
    const currentMonth = this.getCurrentMonth();
    this.currentMonthIncome = this.budgetService.getTotalIncomeForMonth(currentMonth);
    this.currentMonthExpense = this.budgetService.getTotalExpenseForMonth(currentMonth);
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
    const prevExpenses = this.getPreviousMonthExpense();

    this.financialInsightsService.predictExpenses(currentMonth, income, prevExpenses).subscribe(data => {
      this.predictedExpenses = data.predicted_expenses_rf;  // or data.predicted_expenses_arima based on your preference
    });
  }

  getPreviousMonthExpense(): number {
    const previousMonth = this.getPreviousMonth();
    return this.budgetService.getTotalExpenseForMonth(previousMonth) || 0;
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
    this.latestIncome = amount;
    this.updateCurrentMonthTotals();
  }

  updateExpense(amount: number) {
    this.latestExpense = amount;
    this.updateCurrentMonthTotals();
  }
}
