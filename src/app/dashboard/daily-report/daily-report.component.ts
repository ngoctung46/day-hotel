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
    const today = new Date(Date.now());
    let prevDay = new Date();
    prevDay.setDate(today.getDate() - 1);
    let nextDay = new Date();
    nextDay.setDate(today.getDate() + 1);
    await this.paymentService
      .getPaymentsByDateAsync(prevDay, nextDay)
      .then(
        (payments) =>
          (this.payments = payments
            .filter((x) => x.type !== PaymentType.PREPAID)
            .sort((a, b) => b.createdAt! - a.createdAt!))
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
