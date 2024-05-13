import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesRetiredComponent } from './employees-retired.component';

describe('EmployeesRetiredComponent', () => {
  let component: EmployeesRetiredComponent;
  let fixture: ComponentFixture<EmployeesRetiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesRetiredComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeesRetiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
