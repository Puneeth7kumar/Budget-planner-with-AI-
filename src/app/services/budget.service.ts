import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private incomes: { [key: string]: any[] } = {
    January: [
      { source: 'Salary', amount: 5000, investments: '401(k)' },
      { source: 'Freelancing', amount: 1000, investments: 'Stocks' },
    ],
    February: [
      { source: 'Salary', amount: 5500, investments: '401(k)' },
      { source: 'Rental Income', amount: 700, investments: 'Real Estate' },
    ],
    March: [
      { source: 'Salary', amount: 5200, investments: '401(k)' },
      { source: 'Freelancing', amount: 1200, investments: 'Stocks' },
      { source: 'Rental Income', amount: 600, investments: 'Real Estate' },
    ],
  };

  private expenses: { [key: string]: any[] } = {
    January: [
      { expenseType: 'Rent', expenseAmount: 1000 },
      { expenseType: 'Utilities', expenseAmount: 200 },
    ],
    February: [
      { expenseType: 'Rent', expenseAmount: 1000 },
      { expenseType: 'Utilities', expenseAmount: 250 },
    ],
    March: [
      { expenseType: 'Rent', expenseAmount: 1000 },
      { expenseType: 'Utilities', expenseAmount: 300 },
    ],
  };

  private todoTransactions: { [key: string]: any[] } = {
    January: [
      { transactionType: 'Study Material', amount: 50 },
      { transactionType: 'Healthcare', amount: 80 },
    ],
    February: [
      { transactionType: 'Home Improvement', amount: 200 },
      { transactionType: 'Gifts', amount: 150 },
    ],
    March: [
      { transactionType: 'Car Maintenance', amount: 100 },
      { transactionType: 'Miscellaneous', amount: 50 },
    ],
  };
  private incomeSubject = new BehaviorSubject<{ [key: string]: any[] }>(this.incomes);
  private expenseSubject = new BehaviorSubject<{ [key: string]: any[] }>(this.expenses);
  private todoTransactionSubject = new BehaviorSubject<{ [key: string]: any[] }>(this.todoTransactions);

  income$ = this.incomeSubject.asObservable();
  expense$ = this.expenseSubject.asObservable();
  todoTransaction$ = this.todoTransactionSubject.asObservable();

  getIncomesForMonth(month: string): any[] {
    return this.incomes[month] || [];
  }

  addIncome(month: string, income: any): void {
    if (!this.incomes[month]) {
      this.incomes[month] = [];
    }
    this.incomes[month].push(income);
    this.incomeSubject.next(this.incomes);
  }

  getTotalIncomeForMonth(month: string): number {
    return this.getIncomesForMonth(month).reduce((total, income) => total + income.amount, 0);
  }

  addExpense(month: string, expense: { expenseType: string, expenseAmount: number }) {
    if (!this.expenses[month]) {
      this.expenses[month] = [];
    }
    this.expenses[month].push(expense);
    this.expenseSubject.next(this.expenses);
  }

  getExpensesForMonth(month: string): any[] {
    return this.expenses[month] || [];
  }

  getTotalExpenseForMonth(month: string): number {
    return this.getExpensesForMonth(month).reduce((total, expense) => total + expense.expenseAmount, 0);
  }

  getTodoTransactionsForMonth(month: string): any[] {
    return this.todoTransactions[month] || [];
  }

  getTotalTodoTransactionsForMonth(month: string): number {
    return this.getTodoTransactionsForMonth(month).reduce((total, transaction) => total + transaction.amount, 0);
  }

  addTodoTransaction(month: string, transaction: { transactionType: string; amount: number }): void {
    if (!this.todoTransactions[month]) {
      this.todoTransactions[month] = [];
    }
    this.todoTransactions[month].push(transaction);
    this.todoTransactionSubject.next(this.todoTransactions);
  }
}
