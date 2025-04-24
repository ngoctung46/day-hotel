import { Pipe, PipeTransform } from '@angular/core';
import { RoomType } from '../models/const';

@Pipe({
  name: 'RoomType',
})
export class RoomTypePipe implements PipeTransform {
  transform(value: RoomType | unknown): string {
    switch (value) {
      case RoomType.NORMAL:
        return 'Phòng thường'.toUpperCase();
      case RoomType.DELUXE:
        return 'Phòng Deluxe'.toUpperCase();
      case RoomType.VIP:
        return 'Phòng VIP'.toUpperCase();
      default:
        return 'Không xác định'.toUpperCase();
    }
  }
}
