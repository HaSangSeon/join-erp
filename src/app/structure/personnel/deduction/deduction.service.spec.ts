import { TestBed, inject } from '@angular/core/testing';

import { DeductionService } from './deduction.service';

describe('DeductionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeductionService]
    });
  });

  it('should be created', inject([DeductionService], (service: DeductionService) => {
    expect(service).toBeTruthy();
  }));
});
