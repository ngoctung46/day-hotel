import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking } from '../../models/booking';
import { Room } from '../../models/room';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

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
  constructor() {
    const now = new Date(Date.now());
    const dateStr = this.dateToStr(now);
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
    this.added.emit(this.booking);
  }

  private dateToStr(date_Object: Date): string {
    // get the year, month, date, hours, and minutes seprately and append to the string.
    let month = date_Object.getMonth() + 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr =
      date_Object.getDate() < 10
        ? `0${date_Object.getDate()}`
        : `${date_Object.getDate()}`;
    const hourStr =
      date_Object.getHours() < 10
        ? `0${date_Object.getHours()}`
        : `${date_Object.getHours()}`;
    const minutesStr =
      date_Object.getMinutes() < 10
        ? `0${date_Object.getMinutes()}`
        : `${date_Object.getMinutes()}`;

    let date_String: string =
      date_Object.getFullYear() +
      '-' +
      monthStr +
      '-' +
      dayStr +
      'T' +
      hourStr +
      ':' +
      minutesStr;
    return date_String;
  }
}
