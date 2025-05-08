import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
export class BookingsComponent {
  @Output() deleted = new EventEmitter<Booking>();
  @Input() bookings: Booking[] = [];
  get total() {
    let total = 0;
    this.bookings.forEach((b) => (total += b.prepaid!));
    return total;
  }
}
