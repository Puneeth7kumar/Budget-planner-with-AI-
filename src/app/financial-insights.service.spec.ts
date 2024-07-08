import { TestBed } from '@angular/core/testing';

import { FinancialInsightsService } from './financial-insights.service';

describe('FinancialInsightsService', () => {
  let service: FinancialInsightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialInsightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
