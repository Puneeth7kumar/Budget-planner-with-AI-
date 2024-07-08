import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInsightsComponent } from './financial-insights.component';

describe('FinancialInsightsComponent', () => {
  let component: FinancialInsightsComponent;
  let fixture: ComponentFixture<FinancialInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialInsightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinancialInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
