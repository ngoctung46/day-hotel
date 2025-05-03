import { Pipe, PipeTransform } from '@angular/core';
import { PaymentType } from '../models/const';

@Pipe({
  name: 'paymentType',
})
export class PaymentTypePipe implements PipeTransform {
  transform(value: string | undefined): string {
    switch (value) {
      case PaymentType.EXPENSE.toString():
        return 'Chi';
      case PaymentType.RECEIPT.toString():
        return 'Thu';
      case PaymentType.PREPAID.toString():
        return 'Thanh toán trước';
      default:
        return '';
    }
  }
}
