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
import { Booking } from '../models/booking';
import { BookingService } from '../services/booking.service';
import { NoteService } from '../services/note.service';

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
  bookingService = inject(BookingService);
  prepaids: Payment[] = [];
  payments: Payment[] = [];
  orders: Order[] = [];
  bookings: Booking[] = [];
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
    this.getBookings();
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
  getBookings() {
    this.bookingService
      .getItems()
      .then(
        (bookings) =>
          (this.bookings = bookings.sort(
            (a, b) => a.bookingDate! - b.bookingDate!
          ))
      );
  }

  getTotal() {
    this.totalPrepaids = 0;
    this.totalPayments = 0;
    this.totalOrders = 0;
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
  deletePayment(payment: Payment) {
    if (!payment?.id) return;
    this.paymentService.deleteItem(payment.id).then();
    this.getPayments();
    this.getTotal();
  }
  deleteBooking(booking: Booking) {
    if (!booking.id) return;
    this.bookingService.deleteItem(booking.id).then();
    this.getBookings();
  }
}
