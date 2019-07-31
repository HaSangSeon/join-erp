import { TestBed, inject } from '@angular/core/testing';

import { Test1Service } from './test1.service';

describe('Test1Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Test1Service]
    });
  });

  it('should be created', inject([Test1Service], (service: Test1Service) => {
    expect(service).toBeTruthy();
  }));
});
