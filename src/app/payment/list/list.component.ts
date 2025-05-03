import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'payment-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  router = inject(Router);
  paymentService = inject(PaymentService);
  @Input()
  payments: Payment[] = [];
  @Output() updated = new EventEmitter<true>();
  goBack() {
    this.router.navigate(['/']);
  }
  update(payment: Payment) {
    this.paymentService
      .updateItem(payment)
      .then((_) => this.updated.emit(true));
  }
  delete(payment: Payment) {
    this.paymentService
      .deleteItem(payment.id!)
      .then((_) => this.updated.emit(true));
  }
}
