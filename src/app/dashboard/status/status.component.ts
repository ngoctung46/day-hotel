import { Component, inject } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';
import { RoomStatus } from '../../models/const';

@Component({
  selector: 'dashboard-status',
  imports: [],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  roomService = inject(RoomService);
  rooms: Room[] = [];

  constructor() {}

  async ngOnInit() {
    await this.roomService.getItems().then((list) => {
      this.rooms = list;
    });
  }

  get availableCount() {
    return this.rooms.filter(
      (r) =>
        r.status == RoomStatus.AVAILABLE ||
        r.status == RoomStatus.NEED_CLEANING_CUSTOMER_OUT
    ).length;
  }

  get needCleaningCount() {
    return this.rooms.filter(
      (r) =>
        r.status == RoomStatus.NEED_CLEANING_CUSTOMER_IN ||
        r.status == RoomStatus.NEED_CLEANING_CUSTOMER_OUT
    ).length;
  }
}
