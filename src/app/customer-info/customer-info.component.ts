import { Component, inject } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { DateRangePickerComponent } from '../shared-components/date-range-picker.component';
import { DateRange } from '../models/date-range';
import { Customer } from '../models/customer';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-customer-info',
  imports: [DateRangePickerComponent, DatePipe, AsyncPipe],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.css',
})
export class CustomerInfoComponent {
  dateRange: DateRange | undefined = undefined;
  customerService = inject(CustomerService);
  roomService = inject(RoomService);
  customers: Customer[] = [];
  async getDateRange(dateRange: DateRange) {
    this.dateRange = dateRange;
    const customers = await this.customerService.getCustomers(
      this.dateRange?.fromDate,
      this.dateRange?.toDate
    );
    // Fetch room numbers for each customer
    for (const customer of customers) {
      if (customer.roomId) {
        const room = await this.roomService.getItemById(customer.roomId);
        customer.room = room?.number;
      } else {
        customer.room = 0;
      }
    }
    this.customers = customers.sort(
      (a, b) => a.checkInTime!! - b.checkInTime!!
    );
  }
}
