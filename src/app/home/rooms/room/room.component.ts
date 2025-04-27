import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared.module';
import { Room } from '../../../models/room';
import { RouterModule } from '@angular/router';
import { RoomStatus } from '../../../models/const';
import { RoomStatusPipe } from '../../../pipes/room-status.pipe';
import { RoomTypePipe } from '../../../pipes/room-type.pipe';
@Component({
  selector: 'home-room',
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    RoomStatusPipe,
    RoomTypePipe,
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent implements OnInit {
  @Input() room: Room = {};
  @Output() changeRoom = new EventEmitter<Room>();
  rooms: Room[] = [];
  constructor() {}

  ngOnInit() {}

  updateRoomStatus() {
    if (this.room.status === RoomStatus.AVAILABLE) {
      this.room.status = RoomStatus.CHECKED_IN;
    } else if (this.room.status === RoomStatus.CHECKED_IN) {
      this.room.status = RoomStatus.NEED_CLEANING;
    } else if (this.room.status === RoomStatus.NEED_CLEANING) {
      this.room.status = RoomStatus.AVAILABLE;
    }
  }

  updateStatus() {
    if (this.room.status === RoomStatus.NEED_CLEANING) {
      this.room.status = RoomStatus.NEED_CLEANING;
    } else {
      this.room.status = RoomStatus.AVAILABLE;
    }
  }

  // changeRoom(newRoom: Room) {
  //   if (newRoom) {
  //     newRoom.customerId = this.room.customerId;
  //     newRoom.orderId = this.room.orderId;
  //     newRoom.status = RoomStatus.CHECKED_IN;
  //     this.room.customerId = undefined;
  //     this.room.orderId = undefined;
  //     this.room.status = RoomStatus.AVAILABLE;
  //   }
  // }
}
