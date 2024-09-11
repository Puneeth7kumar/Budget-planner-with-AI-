import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { BudgetService } from '../../services/budget.service';
import { AuthService } from '../../auth.service';
import { Income } from '../../models/income.model';
// Update the path as needed

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  incomeForm!: FormGroup;
  selectedMonth: string;
  monthSelected: boolean = false;
  incomes$: Observable<Income[]> = of([]);
  totalIncome$: Observable<number> = of(0);
  // Set a default month or get it dynamically
  currentMonthIncome!: Observable<number>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private budgetService: BudgetService,
    private authService: AuthService
  ) {
    const currentDate = new Date();
    this.selectedMonth = currentDate.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.incomeForm = this.fb.group({
      month: ['', Validators.required],
      source: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      investments: ['', Validators.required]
    });
    this.currentMonthIncome = this.budgetService.getTotalIncomeForMonth(this.selectedMonth);
    // Fetch income data when selectedMonth changes
    this.totalIncome$ = this.budgetService.getTotalIncomeForMonth(this.selectedMonth);
    this.incomes$ = this.budgetService.getIncomesForMonth(this.selectedMonth);
  }

  onChange(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;

    // Update observables with the new month
    this.totalIncome$ = this.budgetService.getTotalIncomeForMonth(this.selectedMonth);
    this.incomes$ = this.budgetService.getIncomesForMonth(this.selectedMonth);
  }

  onSubmit() {
    if (this.incomeForm.valid) {
      const newIncome: Income = this.incomeForm.value;
      this.budgetService.addIncome(this.selectedMonth, newIncome).subscribe(() => {
        // Handle success, e.g., show a message or reset the form
        this.incomeForm.reset();
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
