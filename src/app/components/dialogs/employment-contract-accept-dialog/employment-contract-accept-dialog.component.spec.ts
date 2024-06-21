import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentContractAcceptDialogComponent } from './employment-contract-accept-dialog.component';

describe('EmploymentContractAcceptDialogComponent', () => {
  let component: EmploymentContractAcceptDialogComponent;
  let fixture: ComponentFixture<EmploymentContractAcceptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentContractAcceptDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentContractAcceptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
