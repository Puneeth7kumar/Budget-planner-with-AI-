import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCoachComponent } from './financial-coach.component';

describe('FinancialCoachComponent', () => {
  let component: FinancialCoachComponent;
  let fixture: ComponentFixture<FinancialCoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialCoachComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
