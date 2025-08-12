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
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NOTE_ID, RoomStatus } from '../../models/const';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { NoteService } from '../../services/note.service';
import { Booking } from '../../models/booking';
import { BookingService } from '../../services/booking.service';
import { Utils } from '../../utils';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'home-rooms',
  imports: [RoomComponent, CommonModule, FormsModule, NgbTooltip],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
  host: { class: 'd-block' },
})
export class RoomsComponent implements OnInit {
  @Input() rooms: Room[] = [];
  @Output() changed = new EventEmitter<boolean>();
  roomService = inject(RoomService);
  orderService = inject(OrderService);
  noteService = inject(NoteService);
  bookingService = inject(BookingService);
  customerService = inject(CustomerService);
  modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');
  changedRoom: Room = {};
  changingRoom: Room = {};
  note = '';
  bookings: Booking[] = [];
  ngOnInit(): void {
    this.noteService
      .getItemById(NOTE_ID)
      .then((note) => (this.note = note?.content ?? ''));
    const dateRange = Utils.getCurrentDateRange(2);
    this.bookingService.getItems().then((bookings) => {
      this.bookings = bookings
        .filter(
          (x) =>
            x?.bookingDate! >= new Date(Date.now()).setHours(0, 0, 0) &&
            x?.bookingDate! <= dateRange.toDate?.getTime()!
        )
        .sort((a, b) => a.bookingDate! - b.bookingDate!);
    });
  }
  changeRoom() {
    this.changedRoom.orderId = this.changingRoom.orderId;
    this.changedRoom.customerId = this.changingRoom.customerId;
    this.changedRoom.status = this.changingRoom.status;
    this.changedRoom.extraCustomerIds = this.changingRoom.extraCustomerIds;
    this.roomService.updateItem(this.changedRoom).then();
    this.updateCustomers(this.changedRoom).then();
    this.updateOrderAsync(this.changingRoom.orderId!, this.changedRoom.id!);
    this.changingRoom.orderId = '';
    this.changingRoom.customerId = '';
    this.changingRoom.status = RoomStatus.NEED_CLEANING_CUSTOMER_OUT;
    this.changingRoom.extraCustomerIds = [];
    this.roomService.updateItem(this.changingRoom).then();
    this.changed.emit(true);
  }

  updateOrderAsync(id: string, roomId: string) {
    this.orderService.updateItem({ id, roomId }).then();
  }

  async updateCustomers(room: Room) {
    this.roomService.getCustomersInRoom(room).then((customers) => {
      customers.forEach((customer) => {
        customer.roomId = room.id;
        this.customerService.updateItem(customer).then();
      });
    });
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
  saveNote() {
    if (this.note == '') return;
    this.noteService.updateItem({ id: NOTE_ID, content: this.note });
  }
  deleteNote() {
    this.note = '';
    this.noteService.updateItem({ id: NOTE_ID, content: this.note });
  }
}
