import { Component, inject, OnInit } from '@angular/core';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { PaymentService } from '../services/payment.service';
import { Payment } from '../models/payment';
import { CommonModule, JsonPipe } from '@angular/common';
import { PaymentType } from '../models/const';
import { Utils } from '../utils';

@Component({
  selector: 'app-payment',
  imports: [EditComponent, ListComponent, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  paymentService = inject(PaymentService);
  payments: Payment[] = [];
  ngOnInit() {
    this.getPayments();
  }

  addPayment(payment: Payment) {
    this.paymentService.addItem(payment).then((_) => this.getPayments());
  }

  getPayments() {
    const dateRange = Utils.getCurrentDateRange();

    this.paymentService
      .getPaymentsByDateAsync(dateRange.fromDate, dateRange.toDate)
      .then(
        (payments) =>
          (this.payments = payments.filter(
            (x) => x.type != PaymentType.PREPAID
          ))
      );
  }
  update(updated: boolean) {
    if (updated) this.getPayments();
  }
}
