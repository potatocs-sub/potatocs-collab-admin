import { ComponentFixture, TestBed } from '@angular/core/testing';

import { addRetiredEmployeesDialogComponent } from './add-retired-employees-dialog.component';

describe('addRetiredEmployeesDialogComponent', () => {
  let component: addRetiredEmployeesDialogComponent;
  let fixture: ComponentFixture<addRetiredEmployeesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [addRetiredEmployeesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(addRetiredEmployeesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
