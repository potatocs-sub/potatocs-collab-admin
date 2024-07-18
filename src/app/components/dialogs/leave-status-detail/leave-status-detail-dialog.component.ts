import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-status-detail-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './leave-status-detail-dialog.component.html',
  styleUrl: './leave-status-detail-dialog.component.scss',
})
export class LeaveStatusDetailDialogComponent {
  public dialogRef = inject(MatDialogRef<LeaveStatusDetailDialogComponent>);
  public data: any = inject(MAT_DIALOG_DATA);

  viewType: any = {
    annual_leave: 'Annual Leave',
    rollover: 'Rollover',
    sick_leave: 'Sick Leave',
    replacementday_leave: 'Replacement Day',
  };
}
