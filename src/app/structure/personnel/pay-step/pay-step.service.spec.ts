import { TestBed, inject } from '@angular/core/testing';

import { PayStepService } from './pay-step.service';

describe('PayStepService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PayStepService]
    });
  });

  it('should be created', inject([PayStepService], (service: PayStepService) => {
    expect(service).toBeTruthy();
  }));
});
