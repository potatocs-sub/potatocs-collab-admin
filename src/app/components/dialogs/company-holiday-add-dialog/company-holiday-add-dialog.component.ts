import { Component, Inject, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { CompaniesService } from '../../../services/companies/companies.service';
import { HolidayMngmtService } from '../../../services/corporation/holiday-mngmt.service';

@Component({
  selector: 'app-company-holiday-add-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './company-holiday-add-dialog.component.html',
  styleUrl: './company-holiday-add-dialog.component.scss',
})
export class CompanyHolidayAddDialogComponent {
  companyHolidayList: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompanyHolidayAddDialogComponent>,
    private dialogService: DialogService,
    private holidayMngmtService: HolidayMngmtService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.companyHolidayList = data.companyHolidayList;
  }

  companyHolidayForm: FormGroup = this.fb.group({
    holidayName: ['', [Validators.required]],
    holidayDate: ['', [Validators.required]],
  });

  addCompanyHoliday() {
    const formValue = this.companyHolidayForm.value;
    const convertDate = moment(formValue.holidayDate).format('YYYY-MM-DD');
    const companyHolidayData = {
      ch_name: formValue.holidayName,
      ch_date: convertDate,
    };

    // 휴가 중복 체크
    if (this.companyHolidayList) {
      for (let i = 0; i < this.data.companyHolidayList.length; i++) {
        if (this.data.companyHolidayList[i].ch_date == convertDate) {
          this.dialogRef.close();
          return this.dialogService.openDialogNegative(
            'The holiday is duplicated.'
          );
        }
      }
    }

    this.holidayMngmtService.addCompanyHoliday(companyHolidayData).subscribe({
      next: (data: any) => {
        if (data.message == 'Success add company holiday') {
          this.dialogRef.close();
          this.dialogService.openDialogPositive(
            'Successfully, a holiday has been added.'
          );
        }
      },
      error: (err: any) => {
        if (err.error.message == 'Duplicate company holiday error.') {
          this.dialogService.openDialogNegative('The holiday is duplicated.');
        } else if (err.error.message == 'Addings company holiday Error') {
          this.dialogService.openDialogNegative('An error has occurred.');
        }
      }
  });
  }

  // datePickChange(dateValue: any) {
  //   this.companyHolidayForm.get('holidayDate')!.setValue(dateValue);
  // }
}
