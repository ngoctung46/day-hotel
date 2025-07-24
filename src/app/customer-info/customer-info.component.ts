import { Component, inject } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { DateRangePickerComponent } from "../shared-components/date-range-picker.component";
import { DateRange } from '../models/date-range';
import { Customer } from '../models/customer';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-info',
  imports: [DateRangePickerComponent, DatePipe],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.css'
})
export class CustomerInfoComponent {
    dateRange: DateRange | undefined = undefined;
    customerService = inject(CustomerService);
    customers: Customer[] = [];
    getDateRange(dateRange: DateRange) {
      this.dateRange = dateRange;
      this.customerService.getCustomers(this.dateRange?.fromDate, this.dateRange?.toDate)
      .then((customers) => {
        this.customers = customers;
      });
    }
}


