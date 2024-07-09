import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../materials/materials.module';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  dashboardService = inject(DashboardService);

  date = new Date();
  companyEmployee = 0;
  companyRetiredEmployee = 0;
  employmentCountractRequest = 0;
  holiday = 0;

  ngAfterViewInit() {
    this.getDashboard();
  }

  getDashboard() {
    this.dashboardService.getDashboard().subscribe(
      (data: any) => {
        this.companyEmployee = data.countCompanyEmployee;
        this.companyRetiredEmployee = data.countCompanyRetiredEmployee;
        this.employmentCountractRequest = data.countEmploymentCountractRequest;
        this.holiday = data.countHoliday;
      },
      (err: any) => {
        console.log(err.error);
      }
    );
  }
}
