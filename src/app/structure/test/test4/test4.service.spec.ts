import { TestBed, inject } from '@angular/core/testing';

import { Test4Service } from './test4.service';

describe('Test4Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Test4Service]
    });
  });

  it('should be created', inject([Test4Service], (service: Test4Service) => {
    expect(service).toBeTruthy();
  }));
});
