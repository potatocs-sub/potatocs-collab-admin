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
import { ExcelService } from '../../../services/excel/excel.service';

export class Contact {
  name: string = '';
  email: string = '';
  department: string = '';
  position: string = '';
  emp_start_date: string = '';
  emp_end_date: string = '';
  managerId: string = '';
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  employeesService = inject(EmployeesService);
  dialogService = inject(DialogService);
  commonService = inject(CommonService);
  dialog = inject(MatDialog);
  fb = inject(FormBuilder);
  excelService = inject(ExcelService);

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

  // excel
  importContacts: Contact[] = [];
  exportContacts: Contact[] = [];

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

  resetFileInput(fileInput: HTMLInputElement): void {
    fileInput.value = '';
  }

  exportFormat() {
    this.excelService.exportToFile('');
  }

  exportData() {
    this.excelService.exportToFile(this.employeeList.data);
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const data = <any[]>this.excelService.importFromFile(bstr);
      const header: string[] = Object.getOwnPropertyNames(new Contact());
      const importedData = data.slice(1);
      this.importContacts = importedData.map((arr) => {
        const obj: any = {};
        for (let i = 0; i < header.length; i++) {
          const k = header[i];
          obj[k] = arr[i];
        }
        return <Contact>obj;
      });

      // 임포트한 엑셀 데이터에 행이 비어있는 경우 삭제, 비어있으 행이 없는 새로운 배열 생성
      this.importContacts = this.importContacts.filter(
        (data) =>
          !(
            (data.name == '' || data.name == null) &&
            (data.email == '' || data.email == null) &&
            (data.emp_start_date == '' || data.emp_start_date == null) &&
            (data.department == '' || data.department == null) &&
            (data.position == '' || data.position == null) &&
            (data.emp_end_date == '' || data.emp_end_date == null) &&
            (data.managerId == '' || data.managerId == null)
          )
      );

      // 임포트한 엑셀 데이터에 반드시 있어야하는 값이 빈값이 있는 경우 찾기
      let filteredImportedData = this.importContacts.filter(
        (data) =>
          data.email == '' ||
          data.email == null ||
          data.emp_start_date == '' ||
          data.emp_start_date == null
      );

      if (filteredImportedData.length > 0) {
        return this.dialogService.openDialogNegative(
          'There is an empty value on required inputs with (*). Check the excel file.'
        );
      }

      // 임포트한 엑셀 데이터 중 emp_start_date의 셀의 표시형식이 '일반'이 아닌 '날짜' 일 경우
      // 자동적으로 5자리 숫자로 변경되어진다. 만약 그럴경우 원래 날짜로 바꿔주는 작업
      // https://stackoverflow.com/questions/1703505/excel-date-to-unix-timestamp/6154953#6154953   // 엑셀 날짜 계산식
      // https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript // 유닉스 날짜 계산식
      this.importContacts.forEach((element) => {
        if (
          element.emp_start_date.toString().length == 5 &&
          typeof element.emp_start_date == 'number'
        ) {
          element.emp_start_date = this.ExcelDateToJSDate(
            element.emp_start_date
          );
        }
      });

      this.employeesService.importEmployeeList(this.importContacts).subscribe(
        async (data: any) => {
          if (data.message == 'success') {
            this.dialogService.openDialogPositive(
              'Successfully, the file information has been uploaded.'
            );
          }
          this.getEmployeeList();
        },
        (err) => {
          console.log(err.error);
          this.errorAlert(err.error.message);
        }
      );
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // 엑셀의 셀 중 표시형식이 Date인경우 데이터가 5자리 숫자로 바뀐다.
  // 원래 날자로 바꿔주는 코드
  // https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript
  ExcelDateToJSDate(serial: any) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000).toISOString().slice(0, 10);
    return date_info;
  }

  errorAlert(err: any) {
    switch (err) {
      case 'not found email': // 엑셀에 입력된 이메일이 없으면
        this.dialogService.openDialogNegative('Cannot find a email.');
        break;
      case 'not found emp_start_date': // 엑셀에 입력된 계약시작일이 없으면
        this.dialogService.openDialogNegative('Start Date must required');
        break;
      case 'not match date': // 엑셀에 입력된 계약시작일 형식이 잘못됐거나, 셀의 표시형식이 '일반'이 아닌 '날짜'인 경우
        this.dialogService.openDialogNegative(
          "The format of the start date is wrong. Please, change the type 'Short Date' to 'General'"
        );
        break;
      case 'found retired manager': // 엑셀에 입력된 매니저 ID가 퇴사자이면
        this.dialogService.openDialogNegative('Found a retired manager.');
        break;
      case 'not found manager id': // 엑셀에 입력된 매니저 ID가 Member DB에 없으면
        this.dialogService.openDialogNegative('Cannot find a manager.');
        break;
      case 'not found Member': // 엑셀에 입력된 아이디가 DB에 없거나, 회원가입된 아이디가 아니면 에러 메시지
        this.dialogService.openDialogNegative('Cannot find a member');
        break;
      case 'found retired Employee': // 엑셀에 입력된 아이디가 퇴사자면
        this.dialogService.openDialogNegative('Found a retired member');
        break;
      case 'Cannot update Member': // 회원정보 업데이트 실패
        this.dialogService.openDialogNegative('An error has occurred.');
        break;
      case 'failed': // 서버에러
        this.dialogService.openDialogNegative(
          'An error has occurred in the server'
        );
        break;
    }
  }

  editInfo(id: any) {}

  getMyManagerEmployeeList(managerID: any, managerName: any) {
    this.managerName = managerName;
    // Call service to fetch manager's employee list and handle as needed.
  }
}
