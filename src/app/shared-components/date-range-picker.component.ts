import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRange } from '../models/date-range';

@Component({
  selector: 'shared-date-range-picker',
  imports: [FormsModule],
  template: `
    <div class="justify-content-center d-flex">
      <form class="row g-3 row-cols-sm-auto">
        <div class="col-auto">
          <div class="input-group">
            <span for="fromDate" class="input-group-text bg-success text-light"
              >Từ</span
            >

            <input
              name="fromTime"
              type="time"
              class="form-control"
              placeholder="dd/mm/yy"
              [(ngModel)]="fromTime"
            />
            <input
              name="fromDate"
              type="date"
              class="form-control"
              placeholder="dd/mm/yy"
              [(ngModel)]="fromDate"
            />
          </div>
        </div>
        <div class="col-auto">
          <div class="input-group">
            <span for="toDate" class="input-group-text bg-success text-light"
              >Đến</span
            >

            <input
              name="toTime"
              type="time"
              class="form-control"
              placeholder="dd/mm/yyyy"
              [(ngModel)]="toTime"
            />
            <input
              name="toDate"
              type="date"
              class="form-control"
              placeholder="dd/mm/yyyy"
              [(ngModel)]="toDate"
            />
          </div>
        </div>
        <div class="col-auto">
          <div class="input-group">
            <button
              type="submit"
              class="btn btn-primary bi bi-search mb-3 form-control"
              (click)="sendDateRange()"
            ></button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: ``,
})
export class DateRangePickerComponent {
  @Output() dateRange = new EventEmitter<DateRange>();
  fromDate: any;
  toDate: any;
  fromTime: any;
  toTime: any;
  constructor() {
    this.initDateRange();
  }
  sendDateRange() {
    const from = new Date(`${this.fromDate}T${this.fromTime}`);
    const to = new Date(`${this.toDate}T${this.toTime}`);
    this.dateRange.emit({ fromDate: from, toDate: to });
  }
  initDateRange() {
    const datePipe: DatePipe = new DatePipe('en-US');
    const from = new Date(Date.now());
    from.setHours(12, 0, 0);
    from.setDate(from.getDate() - 1);
    this.fromDate = datePipe.transform(from, 'yyyy-MM-dd');
    this.fromTime = datePipe.transform(from, 'HH:mm:ss');
    const to = new Date(Date.now());
    to.setHours(12, 0, 0);
    this.toDate = datePipe.transform(to, 'yyyy-MM-dd');
    this.toTime = datePipe.transform(to, 'HH:mm:ss');
  }
}
