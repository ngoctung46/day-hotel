import { Component, inject, OnInit } from '@angular/core';
import { EditComponent } from './edit/edit.component';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking';
import { ListComponent } from './list/list.component';
import { PaymentService } from '../services/payment.service';
import { PaymentType } from '../models/const';
import { CustomerService } from '../services/customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookings',
  imports: [EditComponent, ListComponent, CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css',
})
export class BookingsComponent implements OnInit {
  roomService = inject(RoomService);
  bookingService = inject(BookingService);
  paymentService = inject(PaymentService);
  customerService = inject(CustomerService);
  rooms: Room[] = [];
  bookings: Booking[] = [];
  customers: any[] = [];
  async ngOnInit() {
    await this.roomService
      .getItems()
      .then(
        (rooms) => (this.rooms = rooms.sort((a, b) => a.number! - b.number!))
      );
    await this.getBookings();
    await this.customerService
      .getItems()
      .then((customers) => (this.customers = customers.filter(c => new Date(c.checkInTime!!) >= new Date(2025, 6, 11,0,0,0) && new Date(c.checkInTime!!) <= new Date(2025, 6, 12, 23, 59, 59))));
  }
  async getBookings() {
    await this.bookingService
      .getItems()
      .then(
        (bookings) =>
          (this.bookings = bookings.sort(
            (a, b) => a.bookingDate! - b.bookingDate!
          ))
      );
  }
  async added(booking: Booking) {
    await this.bookingService.addItem(booking).then(
      async (_) =>
        await this.getBookings().then(async (_) => {
          if (booking.prepaid! > 0) {
            await this.paymentService
              .addItem({
                name: `Đặt cọc`,
                amount: booking?.prepaid ?? 0,
                type: PaymentType.PREPAID,
                room: booking.room,
                roomId: booking.roomId,
                createdAt: booking?.createdAt,
              })
              .then();
          }
        })
    );
  }
  async deleted(booking: Booking) {
    await this.bookingService
      .deleteItem(booking.id!)
      .then(async (_) => await this.getBookings());
  }
}
