import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map, of, switchMap, Observable } from 'rxjs';
import { Loan } from '../models/loan.model';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Income } from '../models/income.model';
import { Expense } from '../models/expense.model';
import { isPlatformBrowser } from '@angular/common';
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

  };

  private incomeSubject = new BehaviorSubject<number>(0);
  private expenseSubject = new BehaviorSubject<number>(0);
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



  constructor(private http: HttpClient, private firestore: AngularFirestore, private authService: AuthService) { }
  fetchLatestData() {
    this.http.get<{ latestIncome: number, latestExpense: number }>('http://localhost:5000/latest-data')
      .subscribe(data => {
        this.latestIncomeSubject.next(data.latestIncome);
        this.latestExpenseSubject.next(data.latestExpense);
      });
  }

  addIncome(month: string, incomeData: Income): Observable<void> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          return this.firestore.collection(`users/${userId}/incomes`).add({
            month,
            ...incomeData
          }).then(() => { });
        }
        return of(undefined);
      })
    );
  }

  getIncomesForMonth(month: string): Observable<Income[]> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          return this.firestore.collection<Income>(`users/${userId}/incomes`, ref =>
            ref.where('month', '==', month)
          ).valueChanges();
        }
        return of([]);
      })
    );
  }

  getTotalIncomeForMonth(month: string): Observable<number> {
    return this.getIncomesForMonth(month).pipe(
      map(incomes => incomes.reduce((total, income) => total + income.amount, 0))
    );
  }

  addExpense(month: string, expenseData: Expense): Observable<void> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          return this.firestore.collection(`users/${userId}/expenses`).add({
            month,
            ...expenseData
          }).then(() => { });
        }
        return of(undefined);
      })
    );
  }

  // Get expenses for a specific month
  getExpensesForMonth(month: string): Observable<Expense[]> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          return this.firestore.collection<Expense>(`users/${userId}/expenses`, ref =>
            ref.where('month', '==', month)
          ).valueChanges();
        }
        return of([]);
      })
    );
  }

  // Calculate total expense for a specific month
  getTotalExpenseForMonth(month: string): Observable<number> {
    return this.getExpensesForMonth(month).pipe(
      map(expenses => expenses.reduce((total, expense) => total + expense.expenseAmount, 0))
    );
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


  private currentMonth = new Date().toLocaleString('default', { month: 'long' });
  // private incomeSubject = new BehaviorSubject<number>(0);
  // private expenseSubject = new BehaviorSubject<number>(0);
  updateIncomeForCurrentMonth(amount: number): void {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        const userId = user.uid;
        const month = new Date().getMonth(); // Get current month dynamically

        // First, fetch the current total income for the month
        this.firestore
          .collection(`users/${userId}/incomes`, (ref) => ref.where('month', '==', month))
          .get()
          .subscribe((snapshot) => {
            let currentTotal = 0;

            // Calculate current total income by summing up existing records
            if (!snapshot.empty) {
              currentTotal = snapshot.docs.reduce(
                (total, doc) => total + (doc.data() as { amount: number }).amount,
                0
              );
            }

            // Add the new income amount
            currentTotal += amount;

            // Update the BehaviorSubject with the new total income
            this.incomeSubject.next(currentTotal);

            // Store the updated income total in Firestore
            this.firestore
              .doc(`users/${userId}/monthlySummary/${month}`)
              .set({ totalIncome: currentTotal }, { merge: true })
              .then(() => {
                console.log('Income updated successfully in Firestore');
              })
              .catch((error) => {
                console.error('Error updating income in Firestore:', error);
              });
          });
      }
    });
  }



  updateExpenseForCurrentMonth(amount: number): void {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        const userId = user.uid;
        const month = this.currentMonth;

        this.firestore
          .collection(`users/${userId}/expenses`, (ref) =>
            ref.where('month', '==', month)
          )
          .get()
          .subscribe((snapshot) => {
            let currentTotal = snapshot.docs.reduce(
              (total, doc) => total + (doc.data() as { expenseAmount: number }).expenseAmount,

              0
            );

            currentTotal += amount;

            // Update BehaviorSubject
            this.expenseSubject.next(currentTotal);

            // Optionally store new total
            this.firestore
              .doc(`users/${userId}/monthlySummary/${month}`)
              .set({ totalExpense: currentTotal }, { merge: true });
          });
      }
    });
  }


}
