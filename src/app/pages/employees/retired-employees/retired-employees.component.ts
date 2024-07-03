import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RetiredEmployeesService } from '../../../services/retired-employees/retired-employees.service';
import { MatDialog } from '@angular/material/dialog';
import { addRetiredEmployeesDialogComponent } from '../../../components/dialogs/add-retired-employees-dialog/add-retired-employees-dialog.component';
import { DialogService } from '../../../stores/dialog/dialog.service';

@Component({
  selector: 'app-retired-employees',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './retired-employees.component.html',
  styleUrl: './retired-employees.component.scss',
})
export class RetiredEmployeesComponent {
  public dialog = inject(MatDialog);
  public dialogService = inject(DialogService);
  retiredEmployeesService = inject(RetiredEmployeesService);
  fb = inject(FormBuilder);

  displayedColumns: string[] = [
    'name',
    'email',
    'emp_start_date',
    'resignation_date',
    'cancelButton',
  ];
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
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.getRetiredEmployeeList();
  }

  getRetiredEmployeeList() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.retiredEmployeesService
            .getRetiredEmployeeList(
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
          return res.myEmployeeList;
        })
      )
      .subscribe((data: any) => (this.dataSource = data));
  }

  addRetiredEmployee() {
    const dialogRef = this.dialog.open(addRetiredEmployeesDialogComponent, {});
    dialogRef.afterClosed().subscribe((res) => this.getRetiredEmployeeList());
  }

  cancel(id: string) {
    this.dialogService
      .openDialogConfirm(`Do you want to cancel request?`)
      .subscribe((result) => {
        if (result) {
          this.retiredEmployeesService
            .cancelRetireEmployee(id)
            .subscribe(() => {
              this.dialogService.openDialogPositive('request has been cancel.');
              this.getRetiredEmployeeList();
            });
        }
      });
  }
}
