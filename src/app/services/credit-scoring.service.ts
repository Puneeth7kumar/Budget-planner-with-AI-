import { Injectable } from '@angular/core';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class CreditScoringService {
  getCreditScore(income: number, existingCreditScore: number, employmentStatus: string): number {
    let score = existingCreditScore;

    // Adjust score based on income
    if (income > 100000) {
      score += 50;
    } else if (income > 50000) {
      score += 20;
    } else {
      score -= 20;
    }

    // Adjust score based on employment status
    if (employmentStatus === 'Full-Time') {
      score += 30;
    } else if (employmentStatus === 'Part-Time') {
      score += 10;
    } else {
      score -= 30;
    }

    // Ensure the score is within a valid range
    score = Math.min(Math.max(score, 300), 850);

    return score;
  }
}
