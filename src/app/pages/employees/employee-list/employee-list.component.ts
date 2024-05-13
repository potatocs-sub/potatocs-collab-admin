import { Component, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { EmployeesService } from '../../../services/employees/employees.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {

  employeesService = inject(EmployeesService)
  dialog = inject(MatDialog)

  displayedColumns: string[] = ['name', 'email', 'company', 'delete'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employeeList = new MatTableDataSource;
  managerName = '';
  isRollover = false;

  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  data: any = []


  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.employeesService.getEmployees(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
          ).pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          if (res === null) {
            this.isRateLimitReached = true;
            return [];
          }
          this.isRateLimitReached = false;
          this.resultsLength = res.total_count;
          return res.data;
        }),
      )
      .subscribe((data: any) => (this.employeeList = data));

  }


  connectCompany(id: string) {
    // const dialogRef = this.dialog.open(CompanyConnectDialogComponent, {
    //   data: {
    //     admin_id: id
    //   }
    // });
  }

  deleteAdmin(id: string) {

  }
}
