import { Component, inject, Input, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';
import { CommonModule } from '@angular/common';
import { DateRange } from '../../models/date-range';

@Component({
  selector: 'dashboard-prepaid',
  imports: [CommonModule],
  templateUrl: './prepaid.component.html',
  styleUrl: './prepaid.component.css',
})
export class PrepaidComponent {
  @Input() payments: Payment[] = [];

  get total() {
    let total = 0;
    this.payments.forEach((p) => (total += p.amount));
    return Math.abs(total);
  }

  amount(n: number) {
    return Math.abs(n);
  }
}
