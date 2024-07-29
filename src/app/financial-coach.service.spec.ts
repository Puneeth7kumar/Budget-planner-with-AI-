import { TestBed } from '@angular/core/testing';

import { FinancialCoachService } from './financial-coach.service';

describe('FinancialCoachService', () => {
  let service: FinancialCoachService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialCoachService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
