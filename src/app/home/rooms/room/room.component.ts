import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared.module';
import { Room } from '../../../models/room';
import { RouterModule } from '@angular/router';
import { RoomStatus } from '../../../models/const';

@Component({
  selector: 'home-room',
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent implements OnInit {
  @Input() room: Room = {};
  rooms: Room[] = [];

  constructor() {}

  ngOnInit() {}

  updateStatus(needCleaning = false) {
    if (this.room.status === RoomStatus.CHECKED_OUT) {
      this.room.status = RoomStatus.NEED_CLEANING;
    } else {
      this.room.status = RoomStatus.AVAILABLE;
    }
  }

  changeRoom(room: Room) {
    if (room) {
      room.occupied = true;
      room.customerId = this.room.customerId;
      room.orderId = this.room.orderId;
      room.status = RoomStatus.AVAILABLE;
      this.room.customerId = undefined;
      this.room.orderId = undefined;
      this.room.status = RoomStatus.AVAILABLE;
      this.room.occupied = false;
    }
  }
}
