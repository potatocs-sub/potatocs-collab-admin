import { ApprovalsService } from './../../../services/approvals/approvals.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { FormControl, FormGroup } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../stores/dialog/dialog.service';

@Component({
  selector: 'app-employees-company-connect-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employees-company-connect-dialog.component.html',
  styleUrl: './employees-company-connect-dialog.component.scss'
})
export class EmployeesCompanyConnectDialogComponent {
  private approvalsService = inject(ApprovalsService)
  public dialogRef = inject(MatDialogRef<EmployeesCompanyConnectDialogComponent>)
  public dialogService = inject(DialogService)
  public data: any = inject(MAT_DIALOG_DATA)

  today = new Date();
  date = this.today.getDate()
  month = this.today.getMonth();
  year = this.today.getFullYear();

  setContract = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  })

  onNoClick() {

    this.dialogRef.close();
  }

  // approveRequest
  acceptClick() {
    console.log(this.setContract.value)
    if (this.setContract.value.startDate == null) {
      // return this.dialogService.openDialogNegative('Start Date must be required!');
      this.dialogService.openDialogConfirm(`If you do not input the employee's contract date, the employee cannot request a leave .`).subscribe({
        next: (res: any) => {
          console.log(res)
          if (res) {
            this.setContract.value.startDate = '';
            this.acceptEmploy();
          }
        },
        error: (err: any) => { }
      })
    }

  }

  acceptEmploy() {

    if (this.setContract.value.endDate == null) {
      console.log(this.setContract.value.endDate);
      this.setContract.value.endDate = '';
      console.log(this.setContract.value.endDate);
    }
    const sendData = {
      _id: this.data._id,
      name: this.data.name,
      startDate: this.setContract.value.startDate,
      endDate: this.setContract.value.endDate
    }
    console.log(sendData)

    this.dialogService.openDialogConfirm(`Do you want to accept ${sendData.name}'s request?`).subscribe(result => {
      if (result) {
        this.approvalsService.approveCompanyRequest(sendData).subscribe({
          next: (res: any) => {
            // console.log(data);
            if (res.message == 'approved') {
              this.dialogService.openDialogPositive(sendData.name + '\'s request has been accepted.');
              this.dialogRef.close();
            }
          },
          error: (err: any) => {
            if (err.error.message == '1') {
              console.log('an error while updating');
            } else if (err.error.message == '2') {
              console.log('an error while deleting');
            } else if (err.error.message == 'BlockChain Network Error') {
              console.log('BlockChain Network Error');
              this.dialogService.openDialogNegative(err.error.message);
            }

          }
        }
        );
      }
    })
  }
}
