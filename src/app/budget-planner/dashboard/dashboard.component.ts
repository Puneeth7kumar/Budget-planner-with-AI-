import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { SideNavComponent } from "../side-nav/side-nav.component";
import { FinancialInsightsService } from '../../financial-insights.service';
import { FinancialInsightsComponent } from '../../financial-insights/financial-insights.component';

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

  // todoTransactions = [
  //   { description: 'Pay electricity bill' },
  //   { description: 'Submit monthly report' },
  //   { description: 'Buy groceries' },
  //   { description: 'Call insurance company' }
  // ];
  currentMonthTodoTransactions: any[] = [];

  predictedExpenses: number | undefined;

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

    this.financialInsightsService.predictExpenses(currentMonth).subscribe(data => {
      this.predictedExpenses = data.predicted_expenses;
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
