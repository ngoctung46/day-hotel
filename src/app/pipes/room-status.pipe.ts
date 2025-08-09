import { Pipe, PipeTransform } from '@angular/core';
import { RoomStatus } from '../models/const';

@Pipe({
  name: 'RoomStatus',
})
export class RoomStatusPipe implements PipeTransform {
  transform(value: RoomStatus | undefined): string {
    switch (value) {
      case RoomStatus.AVAILABLE:
        return 'Trống';
      case RoomStatus.CHECKED_IN:
        return 'Có khách';
      case RoomStatus.NEED_CLEANING_CUSTOMER_IN:
        return 'Cần dọn phòng (Có khách)';
      case RoomStatus.NEED_CLEANING_CUSTOMER_OUT:
        return 'Cần dọn phòng (Trống)';
      case RoomStatus.BOOKED:
        return 'Có khách đặt';
      case RoomStatus.CUSTOMER_OUT:
        return 'Khách ra ngoài';
      case RoomStatus.UNDER_MAINTENANCE:
        return 'Đang sửa chữa';
      default:
        return 'Không xác định';
    }
  }
}
