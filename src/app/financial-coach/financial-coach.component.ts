import { Component } from '@angular/core';
import { FinancialCoachService } from '../financial-coach.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-financial-coach',
  templateUrl: './financial-coach.component.html',
  styleUrls: ['./financial-coach.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    // TODO: `HttpClientModule` should not be imported into a component directly.
    // Please refactor the code to add `provideHttpClient()` call to the provider list in the
    // application bootstrap logic and remove the `HttpClientModule` import from this component.
    HttpClientModule]
})
export class FinancialCoachComponent {
  userQuery: string = '';
  advice: string | null = null;

  constructor(private financialCoachService: FinancialCoachService) { }

  getAdvice() {
    this.financialCoachService.getFinancialAdvice1().subscribe(data => {
      this.advice = data.advice;
      if (this.advice) {
        this.speakAdvice(this.advice);
      }
    });
  }

  startVoiceRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const voiceCommand = event.results[0][0].transcript;
      this.userQuery = voiceCommand;
      this.getAdvice();
    };
    recognition.start();
  }

  speakAdvice(text: string) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
  }
}
