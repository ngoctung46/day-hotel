import { Pipe, PipeTransform } from '@angular/core';
import { ProductType } from '../models/const';

@Pipe({
  name: 'productType',
})
export class ProductTypePipe implements PipeTransform {
  transform(value: ProductType | undefined, ...args: unknown[]): string {
    switch (value) {
      case ProductType.ROOM_RATE:
        return 'Giá phòng';
      case ProductType.FOOD:
        return 'Đồ ăn';
      case ProductType.BEVERAGES:
        return 'Nước uống';
      case ProductType.ROOM_SERVICE:
        return 'Dịch vụ phòng';
      case ProductType.DISCOUNT:
        return 'Giảm giá';
      case ProductType.EXTRA_FEE:
        return 'Phụ thu';
      default:
        return '';
    }
  }
}
