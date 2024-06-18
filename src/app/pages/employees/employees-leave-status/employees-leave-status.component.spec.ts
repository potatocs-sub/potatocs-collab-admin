import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesLeaveStatusComponent } from './employees-leave-status.component';

describe('EmployeesLeavesComponent', () => {
  let component: EmployeesLeaveStatusComponent;
  let fixture: ComponentFixture<EmployeesLeaveStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesLeaveStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesLeaveStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
