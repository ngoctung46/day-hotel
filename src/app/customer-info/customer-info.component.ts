import { Component, inject } from '@angular/core';
import { DateRangePickerComponent } from '../shared-components/date-range-picker.component';
import { DateRange } from '../models/date-range';
import { Customer } from '../models/customer';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CustomerHistoriesService } from '../services/customer-histories.service';
import { CustomerHistories } from '../models/customer-histories';

@Component({
  selector: 'app-customer-info',
  imports: [DateRangePickerComponent, DatePipe],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.css',
})
export class CustomerInfoComponent {
  dateRange: DateRange | undefined = undefined;
  customerHistoriesService = inject(CustomerHistoriesService);
  histories: CustomerHistories[] = [];
  async getDateRange(dateRange: DateRange) {
    this.dateRange = dateRange;
    const histories = await this.customerHistoriesService.getHistories(
      this.dateRange?.fromDate,
      this.dateRange?.toDate
    );
    this.histories = histories.sort(
      (a, b) => a.checkInTime!! - b.checkInTime!!
    );
  }
}
