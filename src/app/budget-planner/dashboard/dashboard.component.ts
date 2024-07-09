import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { FinancialInsightsService } from '../../financial-insights.service';
import { FinancialInsightsComponent } from '../../financial-insights/financial-insights.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, MatIconModule, SideNavComponent, FinancialInsightsComponent]
})
export class DashboardComponent implements OnInit {
  lastMonthsIncome: { month: string, total: number }[] = [];
  currentMonthIncome: number = 0;

  lastMonthsExpense: { month: string, total: number }[] = [];
  currentMonthExpense: number = 0;

  currentMonthTodoTransactions: any[] = [];
  predictedExpenses: number | undefined;
  anomalies: string[] = [];
  financialAdvice: string | undefined;

  constructor(public router: Router, private budgetService: BudgetService, private financialInsightsService: FinancialInsightsService) { }

  ngOnInit() {
    this.initializeDashboard();
    this.budgetService.income$.subscribe(() => this.updateCurrentMonthTotals());
    this.budgetService.expense$.subscribe(() => this.updateCurrentMonthTotals());
    this.budgetService.todoTransaction$.subscribe(() => this.updateCurrentMonthTodoTransactions());
  }

  initializeDashboard() {
    this.populateLastMonthsIncome();
    this.populateLastMonthsExpense();
    this.updateCurrentMonthTotals();
    this.updateCurrentMonthTodoTransactions();
    this.getPredictedExpenses();
    this.detectAnomalies();
    this.getFinancialAdvice();
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

  updateCurrentMonthTotals() {
    const currentMonth = this.getCurrentMonth();
    this.currentMonthIncome = this.budgetService.getTotalIncomeForMonth(currentMonth);
    this.currentMonthExpense = this.budgetService.getTotalExpenseForMonth(currentMonth);
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

  get totalCurrentMonthIncome(): number {
    return this.currentMonthIncome;
  }

  get totalCurrentMonthExpense(): number {
    return this.currentMonthExpense;
  }

  get currentMonthSavings(): number {
    return this.totalCurrentMonthIncome - this.totalCurrentMonthExpense;
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
}
