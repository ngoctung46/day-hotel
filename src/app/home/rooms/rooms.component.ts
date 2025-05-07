import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { RoomComponent } from './room/room.component';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../services/room.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomStatus } from '../../models/const';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note';
import { Utils } from '../../utils';

@Component({
  selector: 'home-rooms',
  imports: [RoomComponent, CommonModule, FormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
})
export class RoomsComponent implements OnInit {
  @Input() rooms: Room[] = [];
  @Output() changed = new EventEmitter<boolean>();
  roomService = inject(RoomService);
  orderService = inject(OrderService);
  noteService = inject(NoteService);
  modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');
  changedRoom: Room = {};
  changingRoom: Room = {};
  notes: string[] = ['', '', ''];
  ngOnInit(): void {}
  changeRoom() {
    this.changedRoom.orderId = this.changingRoom.orderId;
    this.changedRoom.customerId = this.changingRoom.customerId;
    this.changedRoom.status = this.changingRoom.status;
    this.roomService.updateItem(this.changedRoom).then();
    this.updateOrderAsync(this.changingRoom.orderId!, this.changedRoom.id!);
    this.changingRoom.orderId = '';
    this.changingRoom.customerId = '';
    this.changingRoom.status = RoomStatus.AVAILABLE;
    this.roomService.updateItem(this.changingRoom).then();
    this.changed.emit(true);
  }

  updateOrderAsync(id: string, roomId: string) {
    this.orderService.updateItem({ id, roomId }).then();
  }

  get availableRooms() {
    return this.rooms.filter((r) => r.status == RoomStatus.AVAILABLE);
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content);
  }

  setRoom(room: Room) {
    this.changingRoom = room;
  }
}
