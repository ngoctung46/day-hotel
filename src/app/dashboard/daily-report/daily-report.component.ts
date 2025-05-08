import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { OrderLineService } from '../../services/order-line.service';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';
import { CommonModule } from '@angular/common';
import { PaymentTypePipe } from '../../pipes/payment-type.pipe';
import { PaymentType } from '../../models/const';
import { DateRange } from '../../models/date-range';

@Component({
  selector: 'dashboard-daily-report',
  imports: [CommonModule, PaymentTypePipe],
  templateUrl: './daily-report.component.html',
  styleUrl: './daily-report.component.css',
})
export class DailyReportComponent {
  @Input() payments: Payment[] = [];
  @Input() tableClass = 'table-success border-success';
  @Output() deleted = new EventEmitter<Payment>();
  get total() {
    let totalReceipt = 0;
    let totalExpense = 0;
    let totalPrepaid = 0;
    this.payments.forEach((p) => {
      if (p.type == PaymentType.RECEIPT) totalReceipt += p.amount;
      if (p.type == PaymentType.EXPENSE) totalExpense += p.amount;
      if (p.type == PaymentType.PREPAID) totalPrepaid += Math.abs(p.amount);
    });
    return totalReceipt - totalExpense + totalPrepaid;
  }
}
