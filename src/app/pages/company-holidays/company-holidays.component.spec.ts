import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHolidaysComponent } from './company-holidays.component';

describe('CompanyHolidaysComponent', () => {
  let component: CompanyHolidaysComponent;
  let fixture: ComponentFixture<CompanyHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyHolidaysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
