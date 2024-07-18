import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { EmployeesService } from '../../../services/employees/employees.service';
import { ExcelService } from '../../../services/excel/excel.service';
import { MatDialog } from '@angular/material/dialog';
import { LeaveStatusDetailDialogComponent } from '../../../components/dialogs/leave-status-detail/leave-status-detail-dialog.component';

@Component({
  selector: 'app-employees-leave-status',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employees-leave-status.component.html',
  styleUrl: './employees-leave-status.component.scss',
})
export class EmployeesLeaveStatusComponent {
  employeesService = inject(EmployeesService);
  excelService = inject(ExcelService);
  dialog = inject(MatDialog);
  fb = inject(FormBuilder);

  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'name',
    'emailFind',
    'leaveType',
    'duration',
    'status',
  ];
  dataSource = new MatTableDataSource();
  searchForm: FormGroup;

  viewType: any = {
    annual_leave: 'Annual Leave',
    rollover: 'Rollover',
    sick_leave: 'Sick Leave',
    replacement_leave: 'Replacement Day',
  };

  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.searchForm = this.fb.group({
      startDateFormControl: new FormControl(''),
      endDateFormControl: new FormControl(''),
      emailFormControl: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.getEmployeeLeaveStatus();
  }

  getEmployeeLeaveStatus() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.employeesService
            .getEmployeeLeaveStatus(
              this.searchForm.value.startDateFormControl,
              this.searchForm.value.endDateFormControl,
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

  exportData() {
    this.excelService.exportToData(this.dataSource);
  }

  openLeaveStatusDetail(data: any) {
    const dialogRef = this.dialog.open(LeaveStatusDetailDialogComponent, {
      data: {
        requestor: data._id,
        requestorName: data.name,
        leaveType: data.leaveType,
        leaveDuration: data.duration,
        leave_end_date: data.endDate,
        leave_start_date: data.startDate,
        leave_reason: data.leave_reason,
        status: data.status,
        createdAt: data.createdAt,
        approver: data.approver,
        rejectReason: data.rejectReason,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
