import { Pipe, PipeTransform } from '@angular/core';
import { PaymentType } from '../models/const';

@Pipe({
  name: 'paymentType',
})
export class PaymentTypePipe implements PipeTransform {
  transform(value: number | undefined): string {
    switch (value) {
      case PaymentType.EXPENSE:
        return 'Chi';
      case PaymentType.RECEIPT:
        return 'Thu';
      case PaymentType.PREPAID:
        return 'Thanh toán trước';
      default:
        return '';
    }
  }
}
