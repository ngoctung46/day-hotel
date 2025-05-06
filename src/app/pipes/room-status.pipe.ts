import { Pipe, PipeTransform } from '@angular/core';
import { RoomStatus } from '../models/const';

@Pipe({
  name: 'RoomStatus',
})
export class RoomStatusPipe implements PipeTransform {
  transform(value: RoomStatus | undefined): string {
    switch (value) {
      case RoomStatus.AVAILABLE:
        return 'Phòng trống';
      case RoomStatus.CHECKED_IN:
        return 'Khách đang ở';
      case RoomStatus.NEED_CLEANING_CUSTOMER_IN:
        return 'Cần dọn phòng (Khách đang ở)';
      case RoomStatus.NEED_CLEANING_CUSTOMER_OUT:
        return 'Cần dọn phòng (Phòng trống)';
      case RoomStatus.BOOKED:
        return 'Có khách đặt';
      case RoomStatus.CUSTOMER_OUT:
        return 'Khách đi ra ngoài';
      case RoomStatus.UNDER_MAINTENANCE:
        return 'Đang bảo trì';
      default:
        return 'Không xác định';
    }
  }
}
