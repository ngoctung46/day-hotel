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
    await this.paymentService
      .getPrepaids(new Date(Date.now()), new Date(Date.now()))
      .then((payments) => (this.payments = payments));
  }

  get total() {
    let total = 0;
    this.payments.forEach((p) => (total += p.amount));
    return total;
  }
}
