import { Component, EventEmitter, inject, Output } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment';
import { PaymentType } from '../../models/const';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'payment-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  @Output() added = new EventEmitter<Payment>();
  paymentService = inject(PaymentService);
  payment: Payment = { name: '', type: PaymentType.RECEIPT, amount: 0 };
  get valid() {
    return this.payment.name != '' && this.payment.amount != 0;
  }

  addPayment() {
    this.payment.createdAt = Date.now();
    this.added.emit(this.payment);
    this.payment.name = '';
    this.payment.amount = 0;
  }
}
