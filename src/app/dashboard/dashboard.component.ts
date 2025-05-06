import { Component, inject, OnInit } from '@angular/core';
import { StatusComponent } from './status/status.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { PrepaidComponent } from './prepaid/prepaid.component';
import { CommonModule } from '@angular/common';
import { BookingsComponent } from './bookings/bookings.component';
import { DateRangePickerComponent } from '../shared-components/date-range-picker.component';
import { DateRange } from '../models/date-range';
import { OrderReportComponent } from '../shared-components/order-report.component';
import { PaymentService } from '../services/payment.service';
import { Payment } from '../models/payment';
import { PaymentType } from '../models/const';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatusComponent,
    DailyReportComponent,
    PrepaidComponent,
    CommonModule,
    BookingsComponent,
    DateRangePickerComponent,
    OrderReportComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  paymentService = inject(PaymentService);
  prepaids: Payment[] = [];
  payments: Payment[] = [];
  ngOnInit(): void {}
  dateRange: DateRange | undefined = undefined;
  getDateRange(dateRange: DateRange) {
    this.dateRange = dateRange;
    this.getPrepaids();
    this.getPayments();
  }
  getPrepaids() {
    this.paymentService
      .getPrepaids(this.dateRange?.fromDate, this.dateRange?.toDate)
      .then(
        (payments) =>
          (this.prepaids = payments.sort((a, b) => b.createdAt! - a.createdAt!))
      );
  }
  getPayments() {
    this.paymentService
      .getItemsByDateRange(this.dateRange?.fromDate, this.dateRange?.toDate)
      .then((payments) => {
        this.payments = payments.filter((x) => x.type != PaymentType.PREPAID);
      });
  }
}
