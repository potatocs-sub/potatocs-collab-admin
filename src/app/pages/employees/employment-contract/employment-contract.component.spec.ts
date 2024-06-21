import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentContractComponent } from './employment-contract.component';

describe('EmploymentContractComponent', () => {
  let component: EmploymentContractComponent;
  let fixture: ComponentFixture<EmploymentContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentContractComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
