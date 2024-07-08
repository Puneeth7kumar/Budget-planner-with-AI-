import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, SideNavComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  todoForm!: FormGroup;
  selectedMonth: string;
  monthSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private budgetService: BudgetService
  ) {
    const currentDate = new Date();
    this.selectedMonth = currentDate.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      month: [this.selectedMonth, Validators.required],
      transactionType: ['', Validators.required],
      amount: ['', Validators.required]
    });

    // Subscribe to the todoTransaction observable to react to changes
    this.budgetService.todoTransaction$.subscribe(() => this.getFilteredTransactions());
  }

  onSubmitExpense() {
    if (this.todoForm.valid) {
      const newTransaction = this.todoForm.value;
      this.budgetService.addTodoTransaction(this.selectedMonth, newTransaction);
      this.todoForm.reset({ month: this.selectedMonth });
    }
  }

  onChangeExpense(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
    this.getFilteredTransactions();
  }

  getFilteredTransactions() {
    return this.budgetService.getTodoTransactionsForMonth(this.selectedMonth);
  }

  calculateTotalTransaction(month: string): number {
    return this.budgetService.getTotalTodoTransactionsForMonth(month);
  }

  onSave() {
    if (this.todoForm.valid) {
      this.todoForm.reset({ month: this.selectedMonth });
      this.getFilteredTransactions();
    }
  }

  onBack() {
    this.router.navigate(['/budget-planner/dashboard']);
  }
}
