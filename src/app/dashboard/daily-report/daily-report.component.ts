import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { OrderLineService } from '../../services/order-line.service';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';
import { CommonModule } from '@angular/common';
import { PaymentTypePipe } from '../../pipes/payment-type.pipe';
import { PaymentType } from '../../models/const';

@Component({
  selector: 'dashboard-daily-report',
  imports: [CommonModule, PaymentTypePipe],
  templateUrl: './daily-report.component.html',
  styleUrl: './daily-report.component.css',
})
export class DailyReportComponent implements OnInit {
  orderService = inject(OrderService);
  orderLineService = inject(OrderLineService);
  paymentService = inject(PaymentService);
  payments: Payment[] = [];
  constructor() {}
  search() {}
  async ngOnInit() {
    await this.getPayments().then();
  }
  async getPayments() {
    const from = new Date(Date.now());
    from.setHours(0, 0, 0);
    const to = new Date(Date.now());
    to.setHours(23, 59, 59);
    await this.paymentService
      .getPaymentsByDateAsync(from, to)
      .then(
        (payments) =>
          (this.payments = payments.filter(
            (x) => x.type !== PaymentType.PREPAID
          ))
      );
  }

  get total() {
    let totalReceipt = 0;
    let totalExpense = 0;
    this.payments.forEach((p) => {
      if (p.type == PaymentType.RECEIPT) totalReceipt += p.amount;
      if (p.type == PaymentType.EXPENSE) totalExpense += p.amount;
    });
    return totalReceipt - totalExpense;
  }
}
