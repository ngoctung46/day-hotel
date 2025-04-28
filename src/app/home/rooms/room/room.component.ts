import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared.module';
import { Room } from '../../../models/room';
import { RouterModule } from '@angular/router';
import { RoomStatus } from '../../../models/const';
import { RoomStatusPipe } from '../../../pipes/room-status.pipe';
import { RoomTypePipe } from '../../../pipes/room-type.pipe';
import { RoomService } from '../../../services/room.service';
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
  roomService = inject(RoomService);
  rooms: Room[] = [];
  constructor() {}

  ngOnInit() {}

  updateCleaningStatus() {
    switch (this.room.status) {
      case RoomStatus.CHECKED_IN:
        this.room.status = RoomStatus.NEED_CLEANING_CUSTOMER_IN;
        this.roomService.updateItem(this.room);
        break;
      case RoomStatus.NEED_CLEANING_CUSTOMER_IN:
        this.room.status = RoomStatus.CHECKED_IN;
        this.roomService.updateItem(this.room);
        break;
      case RoomStatus.NEED_CLEANING_CUSTOMER_OUT:
        this.room.status = RoomStatus.AVAILABLE;
        this.roomService.updateItem(this.room);
        break;
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
