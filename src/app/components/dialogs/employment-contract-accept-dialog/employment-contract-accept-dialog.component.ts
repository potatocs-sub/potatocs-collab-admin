import { EmploymentContractService } from '../../../services/employment-contracts/employment-contracts.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../stores/dialog/dialog.service';

@Component({
  selector: 'app-employment-contract-accept-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employment-contract-accept-dialog.component.html',
  styleUrl: './employment-contract-accept-dialog.component.scss',
})
export class EmploymentContractAcceptDialogComponent {
  private employmentContractService = inject(EmploymentContractService);
  public dialogRef = inject(
    MatDialogRef<EmploymentContractAcceptDialogComponent>
  );
  public dialogService = inject(DialogService);
  public data: any = inject(MAT_DIALOG_DATA);
  destroyRef = inject(DestroyRef);

  today = new Date();
  date = this.today.getDate();
  month = this.today.getMonth();
  year = this.today.getFullYear();

  employmentContractForm = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl(''),
  });

  acceptEmploymentContract() {
    const sendData = {
      _id: this.data._id,
      name: this.data.name,
      startDate: this.employmentContractForm.value.startDate,
      endDate: this.employmentContractForm.value.endDate,
    };

    this.dialogService
      .openDialogConfirm(`Do you want to accept ${sendData.name}'s request?`)
      .subscribe((result) => {
        if (result) {
          this.employmentContractService
            .acceptEmploymentContract(sendData)
            .subscribe({
              next: (res: any) => {
                this.dialogService.openDialogPositive(
                  sendData.name + "'s request has been accepted."
                );
                this.dialogRef.close();
              },
              error: (err: any) => {
                console.log(err);
                this.dialogService.openDialogNegative(err.error.message);
              },
            });
        }
      });
  }
}
