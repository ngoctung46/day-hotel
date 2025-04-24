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
        return 'Đã nhận phòng';
      case RoomStatus.CHECKED_OUT:
        return 'Đã trả phòng';
      case RoomStatus.NEED_CLEANING:
        return 'Cần dọn dẹp';
      case RoomStatus.CUSTOMER_OUT:
        return 'Khách đi ra ngoài';
      case RoomStatus.UNDER_MAINTENANCE:
        return 'Đang bảo trì';
      default:
        return 'Không xác định';
    }
  }
}
