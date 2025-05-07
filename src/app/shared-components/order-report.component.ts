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
      <table
        class="table table-bordered table-striped rounded-2 align-middle border-warning"
      >
        <thead>
          <tr class="table-danger border-warning">
            <th scope="col" class="text-center">STT</th>
            <th>Thời gian</th>
            <th scope="col" class="text-center">Phòng</th>
            <th class="text-center">Hóa đơn</th>
            <th scope="col" class="text-center">Phụ thu</th>
            <th scope="col" class="text-center">Giảm giá</th>
            <th scope="col" class="text-center">Thực thu</th>
          </tr>
        </thead>
        <tbody>
          @for (o of orders; track $index) {
          <tr>
            <th scope="row" class="text-center">{{ $index + 1 }}</th>
            <td>{{ o.checkOutTime | date : 'dd/MM HH:mm' }}</td>

            <td class="text-center">{{ getRoomNumber(o.roomId!) }}</td>
            <td class="text-end">
              {{ o.total | number }}
            </td>
            <td class="text-end">
              {{ o.charges | number }}
            </td>
            <td class="text-end">
              {{ o.discount | number }}
            </td>
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
  @Input() orders: Order[] = [];
  total = 0;
  charges = 0;
  discount = 0;
  roomService = inject(RoomService);
  orderService = inject(OrderService);
  rooms: Room[] = [];
  ngOnInit(): void {
    this.roomService.getItems().then((rooms) => (this.rooms = rooms));
    this.getTotals();
  }
  getRoomNumber(id: string) {
    let room = this.rooms.find((r) => r.id == id) ?? {};
    return room.number ?? '';
  }
  getTotals() {
    this.orders.forEach((order) => {
      this.total += order.total ?? 0;
      this.charges += order.charges ?? 0;
      this.discount += order.discount ?? 0;
    });
  }
}
