import { Component } from '@angular/core';
import { SpamDetectionService } from '../../services/spam-detection.service';

@Component({
  selector: 'app-email-checker',
  templateUrl: './email-checker.component.html',
  styleUrls: ['./email-checker.component.scss']
})
export class EmailCheckerComponent {
  emailContent: string = '';  // User input for email content
  isSpam: boolean = false;    // Holds the result if email is spam
  classification: string = ''; // Holds classification result ('Spam' or 'Not Spam')
  errorMessage: string = '';   // Error message to display if API fails

  constructor(private spamDetectionService: SpamDetectionService) { }

  checkEmail() {
    // Validate if email content is entered
    if (this.emailContent.trim()) {
      // Call the service to check if the email is spam
      this.spamDetectionService.checkSpam(this.emailContent).subscribe(
        (response) => {
          this.isSpam = response.isSpam;
          this.classification = response.isSpam ? 'Spam' : 'Not Spam';
        },
        (error) => {
          this.errorMessage = 'Error while checking email. Please try again.';
          console.error('Error checking spam:', error);
        }
      );
    } else {
      this.errorMessage = 'Please enter email content to check.';
    }
  }
}
