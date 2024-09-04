import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  fetchEmails(): Observable<{ emails: any[] }> {
    return this.http.get<{ emails: any[] }>('http://localhost:3000/fetch-emails');
  }

  processEmailContent(emails: any[]): { credited: number, debited: number, emailDetails: any[] } {
    let credited = 0;
    let debited = 0;
    const emailDetails: any[] = [];

    emails.forEach(email => {
      if (email.amount.includes('credited')) {
        credited += parseFloat(email.amount.split(' ')[0]);
      } else if (email.amount.includes('debited')) {
        debited += parseFloat(email.amount.split(' ')[0]);
      }

      emailDetails.push({
        from: email.from,
        subject: email.subject,
        amount: email.amount,
      });
    });

    return { credited, debited, emailDetails };
  }
}
