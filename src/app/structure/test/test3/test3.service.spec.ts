import { TestBed, inject } from '@angular/core/testing';

import { Test3Service } from './test3.service';

describe('Test3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Test3Service]
    });
  });

  it('should be created', inject([Test3Service], (service: Test3Service) => {
    expect(service).toBeTruthy();
  }));
});
