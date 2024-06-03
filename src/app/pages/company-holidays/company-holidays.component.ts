import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../materials/materials.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { CompaniesService } from '../../services/companies/companies.service';
import { MatDialog } from '@angular/material/dialog';
import { CompanyHolidayAddDialogComponent } from '../../components/dialogs/company-holiday-add-dialog/company-holiday-add-dialog.component';
import { HolidayMngmtService } from '../../services/corporation/holiday-mngmt.service';

@Component({
  selector: 'app-company-holidays',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './company-holidays.component.html',
  styleUrl: './company-holidays.component.scss',
})
export class CompanyHolidaysComponent {
  holidayMngmtService = inject(HolidayMngmtService);

  company: any;
  manager: any;

  isLoadingResults = signal<boolean>(true);
  isRateLimitReached = signal<boolean>(false);

  companyHolidayList = new MatTableDataSource();

  // view table
  displayedColumns: string[] = ['ch_name', 'ch_date', 'menu'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize = signal<number>(10);
  resultsLength = signal<number>(0);

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit() {
    this.getCompanyHolidayList();
  }

  getCompanyHolidayList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults.set(true);
          return this.holidayMngmtService
            .getCompanyHoliday(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize
            )
            .pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          this.isLoadingResults.set(false);
          if (res === null) {
            this.isRateLimitReached.set(true);
            return [];
          }
          this.isRateLimitReached.set(false);
          this.resultsLength = res.total_count;
          return res.myEmployeeList;
        })
      )
      .subscribe((data: any) => (this.companyHolidayList = data));
  }

  openAddCompanyHoliday() {
    const dialogRef = this.dialog.open(CompanyHolidayAddDialogComponent, {
      data: {
        companyHolidayList: this.companyHolidayList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCompanyHolidayList();
    });
  }

  deleteCompanyHoliday(id: any) {}
}
