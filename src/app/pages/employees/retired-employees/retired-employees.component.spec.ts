import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiredEmployeesComponent } from './retired-employees.component';

describe('RetiredEmployeesComponent', () => {
  let component: RetiredEmployeesComponent;
  let fixture: ComponentFixture<RetiredEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetiredEmployeesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RetiredEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
