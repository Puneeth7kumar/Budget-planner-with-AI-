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
    April: [
      { source: 'Salary', amount: 1000, investments: '401(k)' },
      { source: 'Freelancing', amount: 1200, investments: 'Stocks' },
      { source: 'Rental Income', amount: 600, investments: 'Real Estate' },
    ],
    May: [
      { source: 'Salary', amount: 1900, investments: '401(k)' },
      { source: 'Freelancing', amount: 100, investments: 'Stocks' },
      { source: 'Rental Income', amount: 6000, investments: 'Real Estate' },
    ],
    June: [
      { source: 'Salary', amount: 1900, investments: '401(k)' },
      { source: 'Freelancing', amount: 120, investments: 'Stocks' },
      { source: 'Rental Income', amount: 1600, investments: 'Real Estate' },
    ],
    July: [
      { source: 'Salary', amount: 2000, investments: '401(k)' },
      { source: 'Freelancing', amount: 1200, investments: 'Stocks' },
      { source: 'Rental Income', amount: 500, investments: 'Real Estate' },
    ],
    August: [
      { source: 'Salary', amount: 5000, investments: '401(k)' },
      { source: 'Freelancing', amount: 1000, investments: 'Stocks' },
      { source: 'Rental Income', amount: 400, investments: 'Real Estate' },
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
    April: [
      { expenseType: 'Rent', expenseAmount: 2000 },
      { expenseType: 'Utilities', expenseAmount: 300 },
    ],
    May: [
      { expenseType: 'Rent', expenseAmount: 500 },
      { expenseType: 'Utilities', expenseAmount: 200 },
    ],
    June: [
      { expenseType: 'Rent', expenseAmount: 2000 },
      { expenseType: 'Utilities', expenseAmount: 90 },
    ],
    July: [
      { expenseType: 'Rent', expenseAmount: 2000 },
      { expenseType: 'Utilities', expenseAmount: 100 },
    ],
    August: [
      { expenseType: 'Rent', expenseAmount: 1500 },
      { expenseType: 'Utilities', expenseAmount: 100 },
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

  private loans: { [key: string]: Loan[] } = {
    // January: [
    //   { amount: 5000, interestRate: 3.5, term: 36, loanType: 'Personal', documents: File | null, income: 60000, existingCreditScore: 720, employmentStatus: 'Employed' },
    //   { amount: 10000, interestRate: 4.2, term: 48, loanType: 'Auto', documents: 'Pay Stubs', income: 55000, existingCreditScore: 680, employmentStatus: 'Self-Employed' },
    // ],
    // February: [
    //   { amount: 7000, interestRate: 2.9, term: 24, loanType: 'Education', documents: 'ID Proof', income: 45000, existingCreditScore: 700, employmentStatus: 'Student' },
    //   { amount: 15000, interestRate: 5.0, term: 60, loanType: 'Home', documents: 'Property Papers', income: 75000, existingCreditScore: 750, employmentStatus: 'Employed' },
    // ],
    // March: [
    //   { amount: 12000, interestRate: 3.7, term: 36, loanType: 'Business', documents: 'Tax Returns', income: 80000, existingCreditScore: 710, employmentStatus: 'Business Owner' },
    //   { amount: 5000, interestRate: 4.0, term: 12, loanType: 'Personal', documents: 'Bank Statements', income: 52000, existingCreditScore: 690, employmentStatus: 'Employed' },
    // ],
  };

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
    this.http.get<{ latestIncome: number, latestExpense: number }>('http://localhost:5000/latest-data')
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
