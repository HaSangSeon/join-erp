import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayStepComponent } from './pay-step.component';

describe('PayStepComponent', () => {
  let component: PayStepComponent;
  let fixture: ComponentFixture<PayStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
