import { EmploymentContractService } from '../../../services/employment-contracts/employment-contracts.service';
import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../../../materials/materials.module';
import { EmploymentContractAcceptDialogComponent } from '../../../components/dialogs/employment-contract-accept-dialog/employment-contract-accept-dialog.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employment-contract',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employment-contract.component.html',
  styleUrl: './employment-contract.component.scss',
})
export class EmploymentContractComponent {
  public dialog = inject(MatDialog);
  public dialogService = inject(DialogService);
  employmentContractService = inject(EmploymentContractService);
  fb = inject(FormBuilder);

  displayedColumns: string[] = ['name', 'email', 'status', 'createdAt', 'btns'];
  dataSource = new MatTableDataSource();
  searchForm: FormGroup;

  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.searchForm = this.fb.group({
      nameFormControl: new FormControl(''),
      emailFormControl: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.getEmploymentContract();
  }

  getEmploymentContract() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.employmentContractService
            .getEmploymentContract(
              this.searchForm.value.nameFormControl,
              this.searchForm.value.emailFormControl,
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize
            )
            .pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          this.isLoadingResults = false;
          if (res === null) {
            this.isRateLimitReached = true;
            return [];
          }
          this.isRateLimitReached = false;
          this.resultsLength = res.totalCount;
          return res.data;
        })
      )
      .subscribe((data: any) => (this.dataSource = data));
  }

  accept(id: any, name: any) {
    const dialogRef = this.dialog.open(
      EmploymentContractAcceptDialogComponent,
      {
        data: {
          _id: id,
          name: name,
        },
      }
    );
    dialogRef.afterClosed().subscribe((res) => this.getEmploymentContract());
  }

  reject(id: any, name: any) {
    const sendData = {
      _id: id,
    };

    this.dialogService
      .openDialogConfirm(`Do you want to reject ${name}'s request?`)
      .subscribe((result) => {
        if (result) {
          this.employmentContractService
            .rejectEmploymentContract(sendData)
            .subscribe({
              next: (res: any) => {
                this.dialogService.openDialogPositive(
                  'Successfully rejected' + name + "'s request."
                );
                this.getEmploymentContract();
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
