import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHolidayAddDialogComponent } from './company-holiday-add-dialog.component';

describe('CompanyHolidayAddDialogComponent', () => {
  let component: CompanyHolidayAddDialogComponent;
  let fixture: ComponentFixture<CompanyHolidayAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyHolidayAddDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyHolidayAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
