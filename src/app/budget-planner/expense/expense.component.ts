import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BudgetService } from '../../services/budget.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  selectedMonth: string;
  monthSelected: boolean = false;
  expenses$: Observable<Expense[]> = of([]);
  totalExpense$: Observable<number> = of(0);
  currentMonthExpense!: Observable<number>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private budgetService: BudgetService
  ) {
    const currentDate = new Date();
    this.selectedMonth = currentDate.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: [0, [Validators.required, Validators.min(0)]]
    });

    // Fetch expense data for the current selected month
    this.currentMonthExpense = this.budgetService.getTotalExpenseForMonth(this.selectedMonth);
    this.totalExpense$ = this.budgetService.getTotalExpenseForMonth(this.selectedMonth);
    this.expenses$ = this.budgetService.getExpensesForMonth(this.selectedMonth);
  }

  onChange(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;

    // Update observables with the new month
    this.totalExpense$ = this.budgetService.getTotalExpenseForMonth(this.selectedMonth);
    this.expenses$ = this.budgetService.getExpensesForMonth(this.selectedMonth);
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const newExpense = this.expenseForm.value;
      this.budgetService.addExpense(this.selectedMonth, newExpense).subscribe(() => {
        // Handle success, e.g., show a message or reset the form
        this.expenseForm.reset();
      });
    }
  }

  onBack() {
    this.router.navigate(['/budget-planner/dashboard']);
  }

  saveForm() {
    console.log("Form saved!");
  }
}
