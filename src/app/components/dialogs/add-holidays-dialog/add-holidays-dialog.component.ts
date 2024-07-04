import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { HolidaysService } from '../../../services/holidays/holidays.service';

@Component({
  selector: 'app-add-holidays-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './add-holidays-dialog.component.html',
  styleUrl: './add-holidays-dialog.component.scss',
})
export class AddHolidaysDialogComponent {
  fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddHolidaysDialogComponent>);
  private dialogService = inject(DialogService);
  holidaysService = inject(HolidaysService);
  public data = inject(MAT_DIALOG_DATA);

  holidayList: any;

  constructor() {
    this.holidayList = this.data.holidayList;
  }

  addHolidayForm: FormGroup = this.fb.group({
    holidayName: ['', [Validators.required]],
    holidayDate: ['', [Validators.required]],
  });

  addHoliday() {
    const formValue = this.addHolidayForm.value;
    const convertDate = moment(formValue.holidayDate).format('YYYY-MM-DD');
    const holidayData = {
      ch_name: formValue.holidayName,
      ch_date: convertDate,
    };

    // 휴가 중복 체크
    if (this.holidayList) {
      for (let i = 0; i < this.data.holidayList.length; i++) {
        if (this.data.holidayList[i].ch_date == convertDate) {
          this.dialogRef.close();
          return this.dialogService.openDialogNegative(
            'The holiday is duplicated.'
          );
        }
      }
    }

    this.holidaysService.addHoliday(holidayData).subscribe({
      next: (data: any) => {
        this.dialogRef.close();
        this.dialogService.openDialogPositive(
          'Successfully, a holiday has been added.'
        );
      },
      error: (err: any) => {
        if (err.error.message == 'Duplicate holiday error.') {
          this.dialogService.openDialogNegative('The holiday is duplicated.');
        } else if (err.error.message == 'Addings holiday Error') {
          this.dialogService.openDialogNegative('An error has occurred.');
        }
      },
    });
  }
}
