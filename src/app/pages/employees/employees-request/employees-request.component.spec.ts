import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesRequestComponent } from './employees-request.component';

describe('EmployeesCompanyRequestsComponent', () => {
  let component: EmployeesRequestComponent;
  let fixture: ComponentFixture<EmployeesRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
