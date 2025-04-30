import { Component, inject, OnInit } from '@angular/core';
import { RoomStatus } from '../models/const';
import { Room } from '../models/room';
import { RoomService } from '../services/room.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  rooms: Room[] = [];
  orders: Order[] = [];
  roomService = inject(RoomService);
  constructor() {}

  async ngOnInit() {
    await this.roomService.getItems().then((list) => {
      this.rooms = list;
    });
  }

  get availableCount() {
    return this.rooms.filter((r) => r.status == RoomStatus.AVAILABLE).length;
  }

  get needCleaningCount() {
    return this.rooms.filter(
      (r) =>
        r.status ==
        (RoomStatus.NEED_CLEANING_CUSTOMER_IN ||
          RoomStatus.NEED_CLEANING_CUSTOMER_OUT)
    ).length;
  }
}
