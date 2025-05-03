import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Booking } from '../../models/booking';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'booking-list',
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent {
  @Input() bookings: Booking[] = [];
  @Output() deleted = new EventEmitter<Booking>();
  router = inject(Router);
  goBack() {
    this.router.navigate(['/']);
  }
}
