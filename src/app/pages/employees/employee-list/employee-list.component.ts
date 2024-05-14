import { Component, ViewChild, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { EmployeesService } from '../../../services/employees/employees.service';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { CommonService } from '../../../services/common/common.service';
import moment from 'moment';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
  myRank = signal<any>('');
  employeesService = inject(EmployeesService);
  dialogsService = inject(DialogService);
  commonService = inject(CommonService);
  dialog = inject(MatDialog);

  displayedColumns = signal<string[]>([
    'name', 'annual_leave', 'sick_leave', 'replacementday_leave', 'start_date', 'editButton', 'myEmployeeButton'
  ]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employeeList = signal<MatTableDataSource<any>>(new MatTableDataSource<any>());
  managerName = signal<string>('');
  isRollover = signal<boolean>(false);

  pageSize = signal<number>(10);
  resultsLength = signal<number>(0);
  isLoadingResults = signal<boolean>(true);
  isRateLimitReached = signal<boolean>(false);

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.employeesService.getEmployees(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
          ).pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          this.isLoadingResults.set(false);
          if (res === null) {
            this.isRateLimitReached.set(true);
            return [];
          }
          this.isRateLimitReached.set(false);
          this.resultsLength.set(res.total_count);
          this.calculateTenure(res.myEmployeeList);
          return res.myEmployeeList;
        }),
      )
      .subscribe((data: any) => this.employeeList.set(new MatTableDataSource(data)));
  }

  calculateTenure(data: any) {
    data.forEach((employee: any) => {
      const today = moment(new Date(), 'YYYY-MM-DD');
      const startDate = moment(this.commonService.dateFormatting(employee.emp_start_date), 'YYYY-MM-DD');
      const endDate = moment(this.commonService.dateFormatting(employee.emp_end_date), 'YYYY-MM-DD');

      employee.tenure_today = this.calculateYearMonth(startDate, today);
      employee.tenure_end = this.calculateMonths(startDate, endDate);
    });
  }

  calculateYearMonth(start: moment.Moment, end: moment.Moment): string {
    const monthDiffToday = end.diff(start, 'months');
    if (isNaN(monthDiffToday)) return '-';
    const years = Math.floor(monthDiffToday / 12);
    const months = monthDiffToday % 12;
    return `${years} Years ${months} Months`;
  }

  calculateMonths(start: moment.Moment, end: moment.Moment): string {
    const monthDiffEnd = end.diff(start, 'months') + 1;
    if (isNaN(monthDiffEnd)) return '-';
    return `${monthDiffEnd} Months`;
  }

  getMyManagerEmployeeList(managerID: any, managerName: any) {
    this.managerName.set(managerName);
    // Call service to fetch manager's employee list and handle as needed.
  }

  resetFileInput(fileInput: HTMLInputElement): void {
    fileInput.value = '';
  }

  doFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;
    this.employeeList().filter = filterValue.trim().toLowerCase();
  }

  exportFormat() {
    // Implement export format logic
  }

  exportData() {
    // Implement export data logic
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    // Implement file change logic
  }
  editInfo(id: any) {

  }
}
