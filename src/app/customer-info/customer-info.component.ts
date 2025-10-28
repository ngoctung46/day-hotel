import { Component, inject } from '@angular/core';
import { DateRangePickerComponent } from '../shared-components/date-range-picker.component';
import { DateRange } from '../models/date-range';
import { Customer } from '../models/customer';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CustomerHistoriesService } from '../services/customer-histories.service';
import { CustomerHistories } from '../models/customer-histories';
import { CustomerService } from '../services/customer.service';
import { RoomService } from '../services/room.service';
import { Utils } from '../utils';

@Component({
  selector: 'app-customer-info',
  imports: [DateRangePickerComponent, DatePipe],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.css',
})
export class CustomerInfoComponent {
  dateRange: DateRange | undefined = undefined;
  customerHistoriesService = inject(CustomerHistoriesService);
  customerService = inject(CustomerService);
  histories: CustomerHistories[] = [];
  roomService = inject(RoomService);
  customers: Customer[] = [];
  async ngOnInit() {
    this.customers = await this.roomService.getAllStayingCustomers();
  }
  async getDateRange(dateRange: DateRange) {
    this.dateRange = dateRange;
    const histories = await this.customerHistoriesService.getHistories(
      this.dateRange?.fromDate,
      this.dateRange?.toDate
    );
    this.histories = histories.sort(
      (a, b) => a.customer?.checkInTime!! - b.customer?.checkInTime!!
    );
  }

  exportToExcel(): void {
    const columns = [
      { header: 'Tên', key: 'name' },
      { header: 'Số giấy tờ', key: 'idNumber' },
      { header: 'Số phòng', key: 'room' },
      {
        header: 'Vào',
        key: 'checkInTime',
        transform: (v: number) => (v ? new Date(v).toLocaleString() : ''),
      },
      {
        header: 'Ra',
        key: 'checkOutTime',
        transform: (v: number) => (v ? new Date(v).toLocaleString() : ''),
      },
      {
        header: 'BSX',
        key: 'tagNumber',
      },
    ];

    this.customerService.exportCustomersToExcel(
      this.customers,
      columns,
      'Khách đang ở'
    );
    this.customerService.exportCustomersToExcel(
      this.histories.map((h) => h.customer!),
      columns,
      'Lịch sử khách'
    );
  }
}
