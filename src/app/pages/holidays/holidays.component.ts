import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from '../../materials/materials.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { HolidaysService } from '../../services/holidays/holidays.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AddHolidaysDialogComponent } from '../../components/dialogs/add-holidays-dialog/add-holidays-dialog.component';
import { DialogService } from '../../stores/dialog/dialog.service';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.scss',
})
export class HolidaysComponent {
  holidaysService = inject(HolidaysService);
  public dialog = inject(MatDialog);
  public dialogService = inject(DialogService);
  fb = inject(FormBuilder);

  displayedColumns: string[] = ['name', 'date', 'deleteButton'];
  HolidayList = new MatTableDataSource();
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
    });
  }

  ngAfterViewInit() {
    this.getHolidayList();
  }

  getHolidayList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.holidaysService
            .getHolidayList(
              this.searchForm.value.nameFormControl,
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize
            )
            .pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          console.log(res);
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
      .subscribe((data: any) => (this.HolidayList = data));
  }

  openAddHoliday() {
    const dialogRef = this.dialog.open(AddHolidaysDialogComponent, {
      data: {
        holidayList: this.HolidayList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getHolidayList();
    });
  }

  deleteHoliday(id: any) {
    const data = {
      _id: id,
    };

    this.dialogService
      .openDialogConfirm(`Do you want to delete request?`)
      .subscribe((result) => {
        if (result) {
          this.holidaysService.deleteHoliday(data).subscribe(() => {
            this.dialogService.openDialogPositive('request has been delete.');
            this.getHolidayList();
          });
        }
      });
  }
}
