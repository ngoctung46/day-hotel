import { Component, inject, Input, OnInit } from '@angular/core';
import { Order } from '../models/order';
import { CommonModule } from '@angular/common';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { DateRange } from '../models/date-range';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'shared-order-report',
  imports: [CommonModule],
  template: `
    @if(orders.length > 0) {
    <div class="table-responsive">
      <table class="table table-bordered rounded-2 align-middle border-warning">
        <thead>
          <tr class="table-danger border-warning">
            <th scope="col" class="text-center">STT</th>
            <th>Thời gian</th>
            <th scope="col" class="text-center">Phòng</th>
            <th class="text-center">Hóa đơn</th>
            <th scope="col" class="text-center text-primary">Phụ thu</th>
            <th scope="col" class="text-center text-info">Giảm giá</th>
            <th scope="col" class="text-center text-danger">Thực thu</th>
          </tr>
        </thead>
        <tbody>
          @for (o of orders; track $index) {
          <tr>
            <th scope="row" class="text-center">{{ $index + 1 }}</th>
            <th>{{ o.checkOutTime | date : 'dd/MM HH:mm' }}</th>

            <th class="text-center">{{ getRoomNumber(o.roomId!) }}</th>
            <th class="text-end">
              {{ o.total | number }}
            </th>
            <th class="text-end text-primary">
              {{ o.charges | number }}
            </th>
            <th class="text-end text-info">
              {{ o.discount | number }}
            </th>
            <th class="text-end text-danger">
              {{
                (o?.total ?? 0) + (o?.charges ?? 0) - (o?.discount ?? 0)
                  | number
              }}
            </th>
          </tr>
          }
          <tr>
            <th colspan="3" class="text-end">Tổng</th>
            <th class="text-end text-danger">{{ total | number }}</th>
            <th class="text-end text-danger">{{ charges | number }}</th>
            <th class="text-end text-danger">{{ discount | number }}</th>
            <th class="text-end text-danger">
              {{ total + charges - discount | number }}
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    }
  `,
  styles: ``,
})
export class OrderReportComponent implements OnInit {
  @Input() dateRange: DateRange | undefined;
  orders: Order[] = [];
  total = 0;
  charges = 0;
  discount = 0;
  roomService = inject(RoomService);
  orderService = inject(OrderService);
  rooms: Room[] = [];
  ngOnInit(): void {
    this.orderService
      .getOrders(this.dateRange?.fromDate, this.dateRange?.toDate)
      .then((orders) => {
        this.orders = orders;
        this.orders.forEach(async (order) => {
          this.total += order.total ?? 0;
          this.charges += order.charges ?? 0;
          this.discount += order.discount ?? 0;
        });
      });
    this.roomService.getItems().then((rooms) => (this.rooms = rooms));
  }
  getRoomNumber(id: string) {
    let room = this.rooms.find((r) => r.id == id) ?? {};
    return room.number ?? '';
  }
}
