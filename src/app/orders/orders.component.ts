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
  orderLines: OrderLine[] = [];
  room: Room = {};
  router = inject(Router);
  discount = 0;
  extraFee = 0;
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

  getOrder() {
    this.orderService.getItemById(this.orderId).then((order) => {
      this.order = order;
      this.roomService
        .getItemById(order?.roomId!)
        .then((r) => (this.room = r ?? {}));
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

  get checkOutTime() {
    return Date.now;
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
      this.order.checkOutTime = this.checkOutTime();
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
  updateOrderLine(): OrderLine | undefined {
    let rate = this.getRate();
    let ol = this.orderLines.find(
      (ol) => ol.product?.type == ProductType.HOURLY_RATE
    );
    if (ol?.product) {
      ol.product.price = rate;
      ol.quantity = 0;
      ol.total = rate;
      this.orderLineService.updateItem(ol).then();
      this.getOrderLines();
    }
    return ol;
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
  checkOut() {
    this.updateOrderLine();
    this.updateOrder();
    this.updateRoom();
    this.router.navigate(['/home']);
  }

  getRate(): number {
    var timeDiff = this.orderService.getTimeDiff(this.order?.checkInTime!);
    if (timeDiff.hours! <= 5 && timeDiff.days === 0) {
      return this.getHourlyRate(timeDiff);
    }
    return this.getDailyRate();
  }
  getHourlyRate(timeDiff: TimeDiff): number {
    let index = timeDiff.hours === 0 ? 0 : timeDiff.hours! - 1;
    if (timeDiff.hours! >= 4) {
      return this.room.rate!;
    }
    if (timeDiff.minutes! > 30 && timeDiff.hours! > 0) {
      index++;
    }
    return this.room.type === RoomType.NORMAL || RoomType.DELUXE
      ? HourlyRate.NORMAL_OR_DELUXE
      : HourlyRate.VIP;
  }
  getDailyRate(): number {
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
    const extra = this.getHourlyRate(diff);
    return diff.days! * this.room.rate! + extra;
  }
}
