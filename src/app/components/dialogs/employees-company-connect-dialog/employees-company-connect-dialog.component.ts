import { ApprovalsService } from './../../../services/approvals/approvals.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  destroyRef = inject(DestroyRef);

  today = new Date();
  date = this.today.getDate()
  month = this.today.getMonth();
  year = this.today.getFullYear();

  setContract = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl(''),
  })

  onNoClick() {

    this.dialogRef.close();
  }

  // approveRequest
  acceptClick() {
    this.acceptEmploy();
  }

  acceptEmploy() {

    const sendData = {
      _id: this.data._id,
      name: this.data.name,
      startDate: this.setContract.value.startDate,
      endDate: this.setContract.value.endDate
    }

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
