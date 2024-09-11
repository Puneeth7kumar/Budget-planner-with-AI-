import { TestBed } from '@angular/core/testing';

import { SpamDetectionService } from './spam-detection.service';

describe('SpamDetectionService', () => {
  let service: SpamDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpamDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
