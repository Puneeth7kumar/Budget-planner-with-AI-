import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { Loan } from '../../models/loan.model';
import { CommonModule } from '@angular/common';

import { CreditScoringService } from '../../services/credit-scoring.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss']
})
export class LoanComponent implements OnInit {
  loanChart: any;
  loanForm: FormGroup;
  loans: { [key: string]: Loan[] } = {};
  loanTypes: string[] = ['Personal', 'Home', 'Auto', 'Business'];
  creditScore: number = 0;
  isApproved: boolean = false;
  repaymentSchedule: { date: string, amount: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private budgetService: BudgetService,
    private creditScoringService: CreditScoringService,
    private notificationService: NotificationService
  ) {
    this.loanForm = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      interestRate: [0, [Validators.required, Validators.min(0.1)]],
      term: [0, [Validators.required, Validators.min(1)]],
      loanType: ['', Validators.required],
      documents: [null, Validators.required],
      income: [0, Validators.required],
      existingCreditScore: [0, Validators.required],
      employmentStatus: ['', Validators.required]
    });
  }

  get currentMonth(): string {
    return new Date().toLocaleString('default', { month: 'long' });
  }

  addLoan(): void {
    const loan: Loan = this.loanForm.value;
    this.creditScore = this.creditScoringService.getCreditScore(loan.income, loan.existingCreditScore, loan.employmentStatus);

    if (this.creditScore >= 700) {
      this.isApproved = true;
      this.budgetService.addLoan(this.currentMonth, loan);
      this.loadLoans();
      this.repaymentSchedule = this.generateRepaymentSchedule(loan);

      // Send loan approval notification
      this.notificationService.sendLoanApprovalNotification(loan, this.creditScore);

      this.loanForm.reset({
        amount: 0,
        interestRate: 0,
        term: 0,
        loanType: '',
        documents: null,
        income: 0,
        existingCreditScore: 0,
        employmentStatus: ''
      });
    } else {
      this.isApproved = false;

      // Send loan rejection notification
      this.notificationService.sendLoanRejectionNotification(loan, this.creditScore);
    }
  }

  loadLoans(): void {
    this.loans[this.currentMonth] = this.budgetService.getLoansForMonth(this.currentMonth);
  }

  generateRepaymentSchedule(loan: Loan): { date: string, amount: number }[] {
    const schedule = [];
    const principal = loan.amount;
    const monthlyInterestRate = loan.interestRate / 100 / 12;
    const numberOfPayments = loan.term;

    // EMI Formula
    const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    for (let i = 1; i <= numberOfPayments; i++) {
      schedule.push({
        date: new Date(new Date().setMonth(new Date().getMonth() + i)).toLocaleDateString(),
        amount: emi
      });
    }
    return schedule;
  }

  ngOnInit(): void {
    this.loadLoans();
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      this.addLoan();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.loanForm.patchValue({ documents: file });
    }
  }
}
