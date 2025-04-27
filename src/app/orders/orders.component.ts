import { Component, inject, Input } from '@angular/core';
import { OrderLineService } from '../services/order-line.service';
import { OrderLine } from '../models/order-line';
import { CommonModule } from '@angular/common';
import { OrderLineComponent } from './order-line/order-line.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, OrderLineComponent, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  @Input()
  set id(id: string) {
    this.orderId = id;
  }
  orderId = '';
  orderLineService = inject(OrderLineService);
  orderLines: OrderLine[] = [];
  router = inject(Router);
  constructor() {
    this.getOrderLines();
  }

  getOrderLines() {
    this.orderLineService
      .getItems()
      .then(
        (ols) =>
          (this.orderLines = ols.filter((x) => x.orderId == this.orderId))
      );
  }

  get total() {
    let total = 0;
    this.orderLines.forEach((ol) => (total += ol.total!));
    return total;
  }
  goBack() {
    this.router.navigate(['/home']);
  }
  update(ol: OrderLine) {
    ol.total = ol.quantity! * ol.product?.price!;
    this.orderLineService.updateItem(ol);
    this.getOrderLines();
  }
  remove(ol: OrderLine) {
    if (!ol.id) return;
    this.orderLineService.deleteItem(ol.id);
    this.getOrderLines();
  }
}
