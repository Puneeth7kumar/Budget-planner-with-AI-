import { TestBed } from '@angular/core/testing';

import { CreditScoringService } from './credit-scoring.service';

describe('CreditScoringService', () => {
  let service: CreditScoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditScoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
