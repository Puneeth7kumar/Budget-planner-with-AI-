import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  todoForm: any;
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
  }

  onSubmitTransaction() {
    if (this.todoForm.valid) {
      const newTransaction = {
        transactionType: this.todoForm.value.transactionType,
        amount: this.todoForm.value.amount
      };
      this.budgetService.addTodoTransaction(this.selectedMonth, newTransaction);
      this.todoForm.reset({ month: this.selectedMonth, transactionType: '', amount: '' });
    }
  }

  onChangeMonth(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
  }

  getFilteredTransactions() {
    return this.budgetService.getTodoTransactionsForMonth(this.selectedMonth);
  }

  calculateTotalTransactions(month: string): number {
    return this.budgetService.getTotalTodoTransactionsForMonth(month);
  }

  onSave() {
    console.log("Transactions saved!", this.budgetService.getTodoTransactionsForMonth(this.selectedMonth));
  }

  onBack() {
    this.router.navigate(['/budget-planner/dashboard']);
  }

  toggleSelection(transaction: any) {
    // Example method, can be used for additional functionality
    transaction.selected = !transaction.selected;
  }
}
