import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking } from '../../models/booking';
import { Room } from '../../models/room';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Utils } from '../../utils';

@Component({
  selector: 'booking-edit',
  imports: [FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  @Output() added = new EventEmitter<Booking>();
  @Input() rooms: Room[] = [];
  prepaid: number = 0;
  booking: Booking = {};
  bookingTime: string = '';
  bookingDate: string = '';
  selectedRoom: Room = {};
  contactInfo = '';
  constructor() {
    const now = new Date(Date.now());
    const dateStr = Utils.dateToStr(now);
    this.bookingDate = dateStr.split('T')[0];
    this.bookingTime = dateStr.split('T')[1];
    if (this.rooms.length > 0) this.selectedRoom = this.rooms[0];
  }

  add() {
    let dateStr = `${this.bookingDate}T${this.bookingTime}`;
    let date = new Date(dateStr);
    this.booking.bookingDate = date.getTime();
    this.booking.createdAt = Date.now();
    this.booking.prepaid = this.prepaid;
    this.booking.room = this.selectedRoom;
    this.booking.roomId = this.selectedRoom.id;
    this.booking.contactInfo = this.contactInfo;
    this.added.emit(this.booking);
  }

  get valid() {
    return (
      this.bookingDate != '' && this.bookingTime != '' && this.selectedRoom
    );
  }
}
