import { Component, inject, OnInit } from '@angular/core';
import { Booking } from '../../models/booking';
import { BookingService } from '../../services/booking.service';
import { ListComponent } from '../../bookings/list/list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dash-bookings',
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css',
})
export class BookingsComponent implements OnInit {
  bookingService = inject(BookingService);
  bookings: Booking[] = [];
  async ngOnInit() {
    this.bookingService
      .getItems()
      .then(
        (bookings) =>
          (this.bookings = bookings.sort(
            (a, b) => a.bookingDate! - b.bookingDate!
          ))
      );
  }
  get total() {
    let total = 0;
    this.bookings.forEach((b) => (total += b.prepaid!));
    return total;
  }
}
