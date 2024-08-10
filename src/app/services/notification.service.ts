import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private smtpApiUrl = 'http://localhost:3000/send-email'; // Node.js SMTP server URL

  constructor(private http: HttpClient) { }

  sendLoanApprovalNotification(loan: Loan, creditScore: number): void {
    const emailData = {
      to: 'nnm23mc107@nmamit.in',
      subject: 'Loan Approval Notification',
      text: `Your loan application for ${loan.amount} has been approved. Your credit score is ${creditScore}.`
    };

    this.http.post(this.smtpApiUrl, emailData)
      .subscribe(response => {
        console.log('Loan approval notification sent', response);
      }, error => {
        console.error('Error sending loan approval notification', error);
      });
  }

  sendLoanRejectionNotification(loan: Loan, creditScore: number): void {
    const emailData = {
      to: 'nnm23mc107@nmamit.in',
      subject: 'Loan Rejection Notification',
      text: `Your loan application for ${loan.amount} has been rejected. Your credit score is ${creditScore}.`
    };

    this.http.post(this.smtpApiUrl, emailData)
      .subscribe(response => {
        console.log('Loan rejection notification sent', response);
      }, error => {
        console.error('Error sending loan rejection notification', error);
      });
  }
}
