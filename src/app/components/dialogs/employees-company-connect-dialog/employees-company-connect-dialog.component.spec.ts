import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesCompanyConnectDialogComponent } from './employees-company-connect-dialog.component';

describe('EmployeesCompanyConnectDialogComponent', () => {
  let component: EmployeesCompanyConnectDialogComponent;
  let fixture: ComponentFixture<EmployeesCompanyConnectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesCompanyConnectDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeesCompanyConnectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
