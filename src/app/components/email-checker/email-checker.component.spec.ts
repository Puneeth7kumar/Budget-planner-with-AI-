import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCheckerComponent } from './email-checker.component';

describe('EmailCheckerComponent', () => {
  let component: EmailCheckerComponent;
  let fixture: ComponentFixture<EmailCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailCheckerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
