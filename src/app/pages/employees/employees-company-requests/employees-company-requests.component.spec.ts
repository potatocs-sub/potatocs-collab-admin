import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesCompanyRequestsComponent } from './employees-company-requests.component';

describe('EmployeesCompanyRequestsComponent', () => {
  let component: EmployeesCompanyRequestsComponent;
  let fixture: ComponentFixture<EmployeesCompanyRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesCompanyRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeesCompanyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
