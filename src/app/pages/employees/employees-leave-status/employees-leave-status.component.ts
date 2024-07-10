import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { EmployeesService } from '../../../services/employees/employees.service';

@Component({
  selector: 'app-employees-leave-status',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employees-leave-status.component.html',
  styleUrl: './employees-leave-status.component.scss',
})
export class EmployeesLeaveStatusComponent {
  employeesService = inject(EmployeesService);
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
}
