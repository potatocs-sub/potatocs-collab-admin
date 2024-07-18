import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveStatusDetailDialogComponent } from './leave-status-detail-dialog.component';

describe('LeaveStatusDetailDialogComponent', () => {
  let component: LeaveStatusDetailDialogComponent;
  let fixture: ComponentFixture<LeaveStatusDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveStatusDetailDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveStatusDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
