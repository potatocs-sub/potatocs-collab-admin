import { DialogService } from './../../../stores/dialog/dialog.service';
import { Component, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RetiredEmployeesService } from '../../../services/retired-employees/retired-employees.service';
import moment from 'moment';

@Component({
  selector: 'app-add-retired-employees-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './add-retired-employees-dialog.component.html',
  styleUrl: './add-retired-employees-dialog.component.scss',
})
export class addRetiredEmployeesDialogComponent {
  displayedColumns: string[] = [
    'name',
    'email',
    'emp_start_date',
    'resignation_date',
    'addButton',
  ];
  employeeList = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private dialogService = inject(DialogService);
  fb = inject(FormBuilder);
  retiredEmployeesService = inject(RetiredEmployeesService);
  public dialogRef = inject(MatDialogRef<addRetiredEmployeesDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  pageSize = 5;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchForm: FormGroup;
  employeeListForm: FormGroup;

  constructor() {
    this.searchForm = this.fb.group({
      nameFormControl: new FormControl(''),
      emailFormControl: new FormControl(''),
    });

    const startOfMonth = moment().startOf('day').format();

    this.employeeListForm = this.fb.group({
      resignation_date: [startOfMonth, [Validators.required]],
    });
  }

  ngAfterViewInit() {
    this.getEmployeeList();
  }

  getEmployeeList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.retiredEmployeesService
            .getEmployeeList(
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
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          if (res === null) {
            this.isRateLimitReached = true;
            return [];
          }
          this.isRateLimitReached = false;
          this.resultsLength = res.totalCount;
          return res.myEmployeeList;
        })
      )
      .subscribe((data: any) => (this.employeeList.data = data));
  }

  add(id: any) {
    const formValue = this.employeeListForm.value;
    this.dialogService
      .openDialogConfirm(`Do you want to retire the member?`)
      .subscribe((result) => {
        if (result) {
          this.retiredEmployeesService
            .retiredEmployee({
              id: id,
              resignation_date: formValue.resignation_date,
            })
            .subscribe({
              next: (res: any) => {
                this.dialogService.openDialogPositive(
                  'request has been accepted.'
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
