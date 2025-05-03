import { Component, inject, Input } from '@angular/core';
import { OrderLineService } from '../services/order-line.service';
import { OrderLine } from '../models/order-line';
import { CommonModule } from '@angular/common';
import { OrderLineComponent } from './order-line/order-line.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { TimeDiff } from '../models/time-diff';
import { Room } from '../models/room';
import { RoomService } from '../services/room.service';
import {
  HourlyRate,
  ProductType,
  RoomRate,
  RoomStatus,
  RoomType,
} from '../models/const';
import { ProductService } from '../services/product.service';
import { Rate } from '../models/rate';
import { PaymentService } from '../services/payment.service';

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
    this.getOrder();
  }
  orderId = '';
  order: Order | undefined;
  orderLineService = inject(OrderLineService);
  orderService = inject(OrderService);
  roomService = inject(RoomService);
  productService = inject(ProductService);
  paymentService = inject(PaymentService);
  orderLines: OrderLine[] = [];
  room: Room = {};
  router = inject(Router);
  discount = 0;
  extraFee = 0;
  checkOutTime: number = Date.now();
  constructor() {}

  getOrderLines() {
    this.orderLineService.getOrderLinesByOrderId(this.orderId).then((ols) => {
      this.orderLines = ols;
      this.addHourlyRateOrderLine();
    });
  }

  getOrder() {
    this.orderService.getItemById(this.orderId).then((order) => {
      this.order = order;
      this.roomService
        .getItemById(order?.roomId!)
        .then((r) => (this.room = r ?? {}));
      this.getOrderLines();
    });
  }

  get total() {
    let total = 0;
    this.orderLines.forEach((ol) => (total += ol.total!));
    return total;
  }

  get remainingFee() {
    return this.total - this.discount + this.extraFee;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  updateRoom() {
    this.room.status = RoomStatus.NEED_CLEANING_CUSTOMER_OUT;
    this.room.orderId = '';
    this.room.customerId = '';
    this.roomService.updateItem(this.room).then();
  }

  updateOrder() {
    if (this.order) {
      this.order.checkOutTime = this.checkOutTime;
      let total = 0;
      this.orderLines.forEach((ol) => {
        total += ol.total!;
      });
      this.order.total = total;
      this.order.discount = this.discount;
      this.order.charges = this.extraFee;
      this.orderService.updateItem(this.order);
    }
  }
  addHourlyRateOrderLine(persistent: boolean = false) {
    let rates = this.getRates();
    rates = this.roomService.sumRates(rates);
    const orderLineRef = this.orderLineService.createDoc();
    this.productService.getRoomRateOrderLine().then(async (p) => {
      if (!p) return;
      if (p.length > 1) return;
      rates.forEach(async (rate) => {
        p[0].price = rate.rate;
        const newOrderLine = {
          orderId: this.orderId,
          productId: p[0].id,
          quantity: rate.quantity,
          product: p[0],
          total: rate.quantity * rate.rate,
        };
        if (persistent) {
          await this.orderLineService
            .addItem(newOrderLine, orderLineRef)
            .then((_) => this.orderLines.unshift(newOrderLine));
        } else {
          this.orderLines.unshift(newOrderLine);
        }
      });
    });
  }
  update(ol: OrderLine) {
    ol.total = ol.quantity! * ol.product?.price!;
    this.orderLineService.updateItem(ol).then((_) =>
      this.paymentService.getByOrderLineId(ol.id!).then((p) => {
        p.amount = ol.total ?? 0;
        this.paymentService.updateItem(p);
      })
    );
    this.getOrderLines();
  }
  remove(ol: OrderLine) {
    if (!ol.id) return;
    this.orderLineService
      .deleteItem(ol.id)
      .then((_) => this.paymentService.deleteByOrderLineId(ol.id!));
    this.getOrderLines();
  }
  checkOut() {
    this.addHourlyRateOrderLine(true);
    this.updateOrder();
    this.updateRoom();
    this.router.navigate(['/home']);
  }

  getRates(): Rate[] {
    var timeDiff = this.orderService.getTimeDiff(this.order?.checkInTime!);
    if (timeDiff.hours! <= 5 && timeDiff.days === 0) {
      return this.getHourlyRates(timeDiff);
    }
    return this.getDailyRates();
  }
  getHourlyRates(timeDiff: TimeDiff): Rate[] {
    let index = timeDiff.hours === 0 ? 0 : timeDiff.hours! - 1;
    const rate =
      this.room.type === RoomType.NORMAL || RoomType.DELUXE
        ? (HourlyRate.NORMAL_OR_DELUXE as number)
        : (HourlyRate.VIP as number);
    if (timeDiff.hours! >= 4) {
      return [
        {
          rate: this.room.rate!,
          quantity: 1,
        },
      ];
    }
    if (timeDiff.minutes! > 15 && timeDiff.hours! >= 0) {
      index++;
    }

    return [
      {
        rate: rate,
        quantity: index,
      },
    ];
  }
  getDailyRates(): Rate[] {
    let checkInTime = new Date(this.order?.checkInTime!);
    const year = checkInTime.getFullYear()!;
    const month = checkInTime.getMonth();
    let date = checkInTime.getDate();
    const hour = checkInTime.getHours();
    if (hour >= 0 && hour <= 6) {
      date--;
    }
    const start = new Date(year, month, date, 12, 0, 0).getTime();
    const diff = this.orderService.getTimeDiff(start);
    const extra = this.getHourlyRates(diff).pop()!;
    return [{ rate: this.room.rate!, quantity: diff.days! }, extra];
  }
}
