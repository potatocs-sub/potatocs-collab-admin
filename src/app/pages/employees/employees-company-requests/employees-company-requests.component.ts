import { ApprovalsService } from './../../../services/approvals/approvals.service';
import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../../../materials/materials.module';
import { EmployeesCompanyConnectDialogComponent } from '../../../components/dialogs/employees-company-connect-dialog/employees-company-connect-dialog.component';

@Component({
  selector: 'app-employees-company-requests',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employees-company-requests.component.html',
  styleUrl: './employees-company-requests.component.scss'
})
export class EmployeesCompanyRequestsComponent {

  public dialog = inject(MatDialog)
  public dialogsService = inject(DialogService)
  approvalsService = inject(ApprovalsService)

  displayedColumns: string[] = ['email', 'name', 'status', 'createdAt', 'btns'];
  dataSource = new MatTableDataSource;

  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.approvalsService.getCompanyRequest(
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
      .subscribe((data: any) => (this.dataSource = data));

  }

  acceptRequest(id: any, name: any) {
    const dialogRef = this.dialog.open(EmployeesCompanyConnectDialogComponent, {
      data: {
        _id: id,
        name: name
      }
    })

  }
  rejectRequest(id: any, name: any) { }
}
