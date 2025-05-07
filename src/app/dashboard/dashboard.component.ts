import { Component, inject, OnInit } from '@angular/core';
import { StatusComponent } from './status/status.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { CommonModule } from '@angular/common';
import { BookingsComponent } from './bookings/bookings.component';
import { DateRangePickerComponent } from '../shared-components/date-range-picker.component';
import { DateRange } from '../models/date-range';
import { OrderReportComponent } from '../shared-components/order-report.component';
import { PaymentService } from '../services/payment.service';
import { Payment } from '../models/payment';
import { PaymentType } from '../models/const';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TotalReportComponent } from './total-report/total-report.component';
import { Utils } from '../utils';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatusComponent,
    DailyReportComponent,
    CommonModule,
    BookingsComponent,
    DateRangePickerComponent,
    OrderReportComponent,
    NgbNavModule,
    TotalReportComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  active = 1;
  paymentService = inject(PaymentService);
  orderService = inject(OrderService);
  prepaids: Payment[] = [];
  payments: Payment[] = [];
  orders: Order[] = [];
  dateRange: DateRange | undefined = undefined;
  totalPrepaids = 0;
  totalPayments = 0;
  totalOrders = 0;
  ngOnInit(): void {
    this.getDateRange(Utils.getCurrentDateRange());
  }
  getDateRange(dateRange: DateRange) {
    this.dateRange = dateRange;
    this.getPayments();
    this.getOrders();
    this.getTotal();
  }

  getPayments() {
    this.paymentService
      .getItemsByDateRange(this.dateRange?.fromDate, this.dateRange?.toDate)
      .then((payments) => {
        this.payments = payments.filter((x) => x.type != PaymentType.PREPAID);
        this.prepaids = payments.filter((x) => x.type == PaymentType.PREPAID);
      });
  }
  getOrders() {
    this.orderService
      .getOrders(this.dateRange?.fromDate, this.dateRange?.toDate)
      .then((orders) => {
        this.orders = orders;
        this.getTotal();
      });
  }

  getTotal() {
    this.payments.forEach((p) => {
      if (p.type == PaymentType.RECEIPT || p.type == PaymentType.PREPAID)
        this.totalPayments += p.amount;
      else this.totalPayments -= p.amount;
    });
    this.prepaids.forEach((p) => (this.totalPrepaids += Math.abs(p.amount)));
    this.orders.forEach(
      (o) => (this.totalOrders += o.total! - o.discount! + o.charges!)
    );
  }
}
