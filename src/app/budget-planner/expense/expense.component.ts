import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;  // Use '!' to tell TypeScript that this will be initialized before use
  selectedMonth: string;
  monthSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private budgetService: BudgetService
  ) {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    this.selectedMonth = currentMonth;
  }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      month: [this.selectedMonth, Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required]
    });
  }

  onSubmitExpense() {
    if (this.expenseForm.valid) {
      const newExpense = {
        expenseType: this.expenseForm.value.expenseType,
        expenseAmount: this.expenseForm.value.expenseAmount
      };
      this.budgetService.addExpense(this.selectedMonth, newExpense);
      this.expenseForm.reset({ month: this.selectedMonth });
    }
  }

  onChangeExpense(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
  }

  getFilteredExpenses() {
    return this.budgetService.getExpensesForMonth(this.selectedMonth);
  }

  calculateTotalExpense(): number {
    return this.budgetService.getTotalExpenseForMonth(this.selectedMonth);
  }

  onSave() {
    // Placeholder for save logic if needed
  }

  onBack() {
    this.router.navigate(['/budget-planner/dashboard']);
  }
}
