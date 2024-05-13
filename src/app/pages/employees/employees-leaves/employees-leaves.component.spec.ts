import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesLeavesComponent } from './employees-leaves.component';

describe('EmployeesLeavesComponent', () => {
  let component: EmployeesLeavesComponent;
  let fixture: ComponentFixture<EmployeesLeavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesLeavesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeesLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
