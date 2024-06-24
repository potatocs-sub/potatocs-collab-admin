import { Component, ViewChild, inject } from '@angular/core';
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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  employeesService = inject(EmployeesService);
  dialogsService = inject(DialogService);
  commonService = inject(CommonService);
  dialog = inject(MatDialog);
  fb = inject(FormBuilder);

  displayedColumns: string[] = [
    'name',
    'annual_leave',
    'sick_leave',
    'replacementday_leave',
    'start_date',
    'editButton',
    'myEmployeeButton',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employeeList = new MatTableDataSource();
  searchForm: FormGroup;
  managerName = '';
  isRollover = false;

  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor() {
    this.searchForm = this.fb.group({
      nameFormControl: new FormControl(''),
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
          return this.employeesService
            .getEmployees(
              this.searchForm.value.nameFormControl,
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
      .subscribe(
        (data: any) => (this.employeeList = new MatTableDataSource(data))
      );
  }

  getMyManagerEmployeeList(managerID: any, managerName: any) {
    this.managerName = managerName;
    // Call service to fetch manager's employee list and handle as needed.
  }

  resetFileInput(fileInput: HTMLInputElement): void {
    fileInput.value = '';
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

  editInfo(id: any) {}
}
