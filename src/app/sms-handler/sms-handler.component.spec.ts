import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsHandlerComponent } from './sms-handler.component';

describe('SmsHandlerComponent', () => {
  let component: SmsHandlerComponent;
  let fixture: ComponentFixture<SmsHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsHandlerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
