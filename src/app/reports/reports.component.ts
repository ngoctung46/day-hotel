import { Component, inject, OnInit } from '@angular/core';
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  CustomAdapter,
  CustomDateParserFormatter,
} from '../adapters/custom-date.adapter.';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { OrderLineService } from '../services/order-line.service';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reports',
  imports: [
    NgbDatepickerModule,
    FormsModule,
    NgbTimepickerModule,
    CommonModule,
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  router = inject(Router);
  orderService = inject(OrderService);
  orderLineService = inject(OrderLineService);
  roomService = inject(RoomService);
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  fromTime = { hour: 13, minute: 30 };
  toTime = { hour: 23, minute: 59 };
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  rooms: Room[] = [];
  total = 0;
  charges = 0;
  discount = 0;
  constructor(
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
  ) {
    const today = new Date(Date.now());
    const nextDay = new Date();
    nextDay.setDate(today.getDate() + 1);
    this.fromDate = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
    this.toDate = {
      year: nextDay.getFullYear(),
      month: nextDay.getMonth() + 1,
      day: nextDay.getDate(),
    };
  }

  async ngOnInit(): Promise<void> {
    await this.orderService.getItems().then((orders) => (this.orders = orders));
    await this.roomService.getItems().then((rooms) => (this.rooms = rooms));
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday());
  }
  search() {
    let from = new Date(
      this.fromDate.year,
      this.fromDate.month - 1,
      this.fromDate.day,
      12,
      0,
      0,
    );
    let to = new Date(
      this.toDate.year,
      this.toDate.month - 1,
      this.toDate.day,
      12,
      0,
      0,
    );
    this.filteredOrders = this.orders
      .filter(
        (o) =>
          new Date(o?.checkOutTime!) >= from &&
          new Date(o?.checkOutTime!) <= to &&
          (o.total ?? 0) > 0,
      )
      .sort((a, b) => (a.checkOutTime ?? 0) - (b.checkOutTime ?? 0));
    this.filteredOrders.forEach(async (order) => {
      this.total += order.total ?? 0;
      this.charges += order.charges ?? 0;
      this.discount += order.discount ?? 0;
      order.roomId = this.getRoomNumber(order.roomId!).toString();
      await this.orderLineService.getItems().then((o) => {
        let ols = o.filter((x) => x.orderId == order.id && (x.total ?? 0) > 0);
        order.orderLines = ols;
        order.total = ols.reduce((sum, ol) => sum + (ol.total ?? 0), 0);
      });
    });
  }
  getRoomNumber(id: string) {
    let room = this.rooms.find((r) => r.id == id) ?? {};
    return room.number ?? '';
  }
  goBack() {
    this.router.navigate(['/']);
  }

  exportOrdersToExcel() {
    this.orderService.exportOrdersToExcel(
      this.filteredOrders,
      [
        {
          header: 'Thời Gian',
          key: 'checkOutTime',
          transform: (v) => (v ? new Date(v).toLocaleString() : ''),
        },
        { header: 'Phòng', key: 'roomId' },
        { header: 'Mã hóa đơn', key: 'id' },
        { header: 'Thành tiền', key: 'total' },
      ],
      'BC_Doanh_thu',
    );
  }
}
