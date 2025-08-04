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
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'home-room',
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    RoomStatusPipe,
    RoomTypePipe,
    NgbTooltip,
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
  host: { class: 'd-block' },
})
export class RoomComponent implements OnInit {
  @Input() room: Room = {};
  @Output() changeRoom = new EventEmitter<Room>();
  roomService = inject(RoomService);
  rooms: Room[] = [];
  tagNumbers: string = '';
  constructor() {}

  async ngOnInit() {
    await this.getStayingCustomers();
  }

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
  updateCustomerOutStatus() {
    switch (this.room.status) {
      case RoomStatus.CHECKED_IN:
        this.room.status = RoomStatus.CUSTOMER_OUT;
        this.roomService.updateItem(this.room);
        break;
      case RoomStatus.CUSTOMER_OUT:
        this.room.status = RoomStatus.CHECKED_IN;
        this.roomService.updateItem(this.room);
        break;
    }
  }
  async getStayingCustomers() {
    this.roomService.getCustomersInRoom(this.room).then((customers) => {
      this.tagNumbers = customers
        .map((c) => c.tagNumber ?? '')
        .filter((tag) => tag !== '').join(';');
    });
  }
}
