import { Component, OnInit } from '@angular/core';
import { StatusComponent } from './status/status.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { PrepaidComponent } from './prepaid/prepaid.component';
import { CommonModule } from '@angular/common';
import { BookingsComponent } from "./bookings/bookings.component";

@Component({
  selector: 'app-dashboard',
  imports: [
    StatusComponent,
    DailyReportComponent,
    PrepaidComponent,
    CommonModule,
    BookingsComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {}
  now = Date.now();
}
