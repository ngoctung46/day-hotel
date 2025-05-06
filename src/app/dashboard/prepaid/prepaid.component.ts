import { Component, inject, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dashboard-prepaid',
  imports: [CommonModule],
  templateUrl: './prepaid.component.html',
  styleUrl: './prepaid.component.css',
})
export class PrepaidComponent implements OnInit {
  paymentService = inject(PaymentService);
  payments: Payment[] = [];
  async ngOnInit() {
    const today = new Date(Date.now());
    let prevDay = new Date();
    prevDay.setDate(today.getDate() - 1);
    let nextDay = new Date();
    nextDay.setDate(today.getDate() + 1);
    await this.paymentService
      .getPrepaids(prevDay, nextDay)
      .then(
        (payments) =>
          (this.payments = payments.sort((a, b) => b.createdAt! - a.createdAt!))
      );
  }

  get total() {
    let total = 0;
    this.payments.forEach((p) => (total += p.amount));
    return Math.abs(total);
  }

  amount(n: number) {
    return Math.abs(n);
  }
}
