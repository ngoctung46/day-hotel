import { Component, inject } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { OrderLineService } from '../../services/order-line.service';

@Component({
  selector: 'app-daily-report',
  imports: [],
  templateUrl: './daily-report.component.html',
  styleUrl: './daily-report.component.css',
})
export class DailyReportComponent {
  orderService = inject(OrderService);
  orderLineService = inject(OrderLineService);
  orders: Order[] = [];
  total = 0;
  charges = 0;
  discount = 0;
  constructor() {
    this.orderService.getItems().then((orders) => (this.orders = orders));
  }
  search() {
    let from = new Date(Date.now());
    from.setHours(0);
    from.setMinutes(0);
    let to = new Date(Date.now());
    to.setHours(23);
    to.setMinutes(59);
    this.orders = this.orders.filter(
      (o) =>
        new Date(o?.checkOutTime!) >= from && new Date(o?.checkOutTime!) <= to
    );
    this.orders.forEach(async (order) => {
      this.total += order.total ?? 0;
      this.charges += order.charges ?? 0;
      this.discount += order.discount ?? 0;
      await this.orderLineService.getItems().then((o) => {
        let ols = o.filter((x) => x.orderId == order.id);
        order.orderLines = ols;
      });
    });
  }
}
