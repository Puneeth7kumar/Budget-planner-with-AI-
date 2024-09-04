import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private categories = {
    cloth: ['t-shirt', 'jeans', 'shirt', 'jacket', 'sweater'],
    entertainment: ['movie', 'concert', 'event', 'groceries', 'gaming'],
    groceries: ['grocery', 'supermarket', 'food', 'produce']
  };

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

      const category = this.categorizeSubject(email.subject);
      emailDetails.push({
        from: email.from,
        subject: email.subject,
        amount: email.amount,
        category
      });
    });

    return { credited, debited, emailDetails };
  }

  private categorizeSubject(subject: string): string {
    const lowerSubject = subject.toLowerCase();

    if (this.categories.cloth.some(item => lowerSubject.includes(item))) {
      return 'Cloth';
    }
    if (this.categories.entertainment.some(item => lowerSubject.includes(item))) {
      return 'Entertainment';
    }
    if (this.categories.groceries.some(item => lowerSubject.includes(item))) {
      return 'Groceries';
    }

    return 'Others';
  }
}
