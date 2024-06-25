import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/common/common.service';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { EmployeesService } from '../../../services/employees/employees.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss',
})
export class EditEmployeeComponent {
  fb = inject(FormBuilder);
  employeesService = inject(EmployeesService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  commonService = inject(CommonService);
  dialogService = inject(DialogService);

  employeeId: any;
  getEmployeeInfo: any;
  nationList: any;

  employeeDetailForm: FormGroup<any>;
  employeeLeaveForm: FormGroup<any>;

  constructor() {
    this.employeeDetailForm = this.fb.group({
      name: ['', [Validators.required]],
      position: [''],
      location: [''],
      emp_start_date: ['', [Validators.required]],
      emp_end_date: [''],
    });

    this.employeeLeaveForm = this.fb.group({
      annual_leave: ['', [Validators.required]],
      sick_leave: ['', [Validators.required]],
      replacement_leave: [''],
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['id'];
    this.employeesService
      .getEmployeeInfo(this.employeeId)
      .subscribe((data: any) => {
        this.getEmployeeInfo = data.employee;
        this.nationList = data.nationList;

        this.setEmployeeFormValue(this.getEmployeeInfo);
      });
  }

  setEmployeeFormValue(user: any) {
    console.log(user);
    this.employeeDetailForm.get('name')?.setValue(user.name);
    this.employeeDetailForm.get('position')?.setValue(user.position);
    this.employeeDetailForm.get('location')?.setValue(user.location);
    this.employeeDetailForm
      .get('emp_start_date')
      ?.setValue(user.emp_start_date);
    this.employeeDetailForm.get('emp_end_date')?.setValue(user.emp_end_date);
    this.employeeLeaveForm.get('annual_leave')?.setValue(user.annual_leave);
    this.employeeLeaveForm.get('sick_leave')?.setValue(user.sick_leave);
    this.employeeLeaveForm
      .get('replacement_leave')
      ?.setValue(user.replacement_leave);
  }

  backManagerList() {
    this.router.navigate(['employees/list']);
  }

  editEmployeeDetail() {
    if (this.employeeDetailForm.valid) {
      this.dialogService
        .openDialogConfirm('Do you want to edit the employee detail?')
        .subscribe((result) => {
          if (result) {
            let employeeInfo: any;
            const formValue = this.employeeDetailForm.value;

            employeeInfo = {
              employeeId: this.employeeId,
              name: formValue.name,
              position: formValue.position,
              location: formValue.location,
              emp_start_date: this.commonService.dateFormatting(
                formValue.emp_start_date
              ),
              emp_end_date: this.commonService.dateFormatting(
                formValue.emp_end_date
              ),
            };
            if (formValue.emp_start_date == null) {
              employeeInfo.emp_start_date = null;
            }
            if (formValue.emp_end_date == null) {
              employeeInfo.emp_end_date = null;
            }

            this.employeesService
              .putEmployeeProfileInfo(employeeInfo)
              .subscribe(
                (data: any) => {
                  if (data.message == 'updated') {
                    this.router.navigate(['employees/list']);
                    this.dialogService.openDialogPositive(
                      'Successfully, the information has been edited!'
                    );
                  }
                },
                (err) => {
                  console.log(err);
                  if (err.error.message == 'An error has occurred') {
                    this.dialogService.openDialogNegative(
                      'An error has occurred.'
                    );
                  }
                }
              );
          }
        });
    }
  }

  editEmployeeLeave() {
    if (this.employeeLeaveForm.valid) {
      this.dialogService
        .openDialogConfirm('Do you want to edit the employee leave?')
        .subscribe((result) => {
          if (result) {
            let employeeInfo;
            const formValue = this.employeeLeaveForm.value;

            employeeInfo = {
              employeeId: this.employeeId,
              annual_leave: +formValue.annual_leave,
              sick_leave: +formValue.sick_leave,
              replacement_leave: +formValue.replacement_leave,
            };

            this.employeesService.putEmployeeLeaveInfo(employeeInfo).subscribe(
              (data: any) => {
                if (data.message == 'updated') {
                  this.router.navigate(['employees/list']);
                  this.dialogService.openDialogPositive(
                    'Successfully, the information has been edited!'
                  );
                }
              },
              (err) => {
                console.log(err);
                this.dialogService.openDialogNegative(err.error.message);
              }
            );
          }
        });
    }
  }
}
