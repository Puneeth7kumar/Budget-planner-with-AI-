import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Loan } from '../models/loan.model';
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

  private loans: { [key: string]: Loan[] } = {};

  private incomeSubject = new BehaviorSubject<{ [key: string]: any[] }>(this.incomes);
  private expenseSubject = new BehaviorSubject<{ [key: string]: any[] }>(this.expenses);
  private todoTransactionSubject = new BehaviorSubject<{ [key: string]: any[] }>(this.todoTransactions);
  private latestIncomeSubject = new BehaviorSubject<number | undefined>(undefined);
  private latestExpenseSubject = new BehaviorSubject<number | undefined>(undefined);
  private loanSubject = new BehaviorSubject<{ [key: string]: Loan[] }>(this.loans);
  income$ = this.incomeSubject.asObservable();
  expense$ = this.expenseSubject.asObservable();
  todoTransaction$ = this.todoTransactionSubject.asObservable();
  loan$ = this.loanSubject.asObservable();
  latestIncome$ = this.latestIncomeSubject.asObservable();
  latestExpense$ = this.latestExpenseSubject.asObservable();

  constructor(private http: HttpClient) { }
  fetchLatestData() {
    this.http.get<{ latestIncome: number, latestExpense: number }>('https://1440-103-141-113-225.ngrok-free.app/latest-data')
      .subscribe(data => {
        this.latestIncomeSubject.next(data.latestIncome);
        this.latestExpenseSubject.next(data.latestExpense);
      });
  }
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
  getLoansForMonth(month: string): Loan[] {
    return this.loans[month] || [];
  }

  addLoan(month: string, loan: Loan): void {
    if (!this.loans[month]) {
      this.loans[month] = [];
    }
    loan.emi = this.calculateEMI(loan.amount, loan.interestRate, loan.term);
    this.loans[month].push(loan);
    this.loanSubject.next(this.loans);
  }

  getTotalLoanForMonth(month: string): number {
    return this.getLoansForMonth(month).reduce((total, loan) => total + loan.amount, 0);
  }

  private calculateEMI(amount: number, interestRate: number, term: number): number {
    let monthlyRate = interestRate / (12 * 100);
    return (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
  }

}
