import { Component, inject, Input } from '@angular/core';
import { OrderLineService } from '../services/order-line.service';
import { OrderLine } from '../models/order-line';
import { CommonModule, Time } from '@angular/common';
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
import { NgxPrintModule, NgxPrintService, PrintOptions } from 'ngx-print';
import { Utils } from '../utils';
import { CustomerService } from '../services/customer.service';
import { CustomerHistoriesService } from '../services/customer-histories.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, OrderLineComponent, FormsModule, NgxPrintModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  @Input()
  set id(id: string) {
    this.orderId = id;
    this.getOrder();
  }
  printService = inject(NgxPrintService);
  orderId = '';
  order: Order | undefined;
  orderLineService = inject(OrderLineService);
  orderService = inject(OrderService);
  roomService = inject(RoomService);
  productService = inject(ProductService);
  paymentService = inject(PaymentService);
  customerSerivce = inject(CustomerService);
  customerHistoriesService = inject(CustomerHistoriesService);
  orderLines: OrderLine[] = [];
  room: Room = {};
  router = inject(Router);
  discount = 0;
  extraFee = 0;
  checkOutTime: number = Date.now();
  isPrinting = false;
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
    this.room.extraCustomerIds = [];
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

  async checkOutCustomersAsync() {
    let customers = await this.customerSerivce.getCustomersInRoom(this.room);
    for (const customer of customers) {
      customer.checkOutTime = this.checkOutTime;
      await this.customerSerivce.updateItem(customer);
      await this.customerHistoriesService.addItem({
        customerId: customer.id,
        roomId: this.room.id,
        roomNumber: this.room.number,
        orderId: this.orderId,
        checkInTime: customer.checkInTime,
        checkOutTime: customer.checkOutTime,
      });
    }
  }
  addHourlyRateOrderLine(persistent: boolean = false) {
    let rates = this.getRates();
    rates = this.roomService.sumRates(rates);
    const orderLineRef = this.orderLineService.createDoc();
    rates.forEach(async (rate) => {
      const newOrderLine = {
        orderId: this.orderId,
        product: {
          name: 'Tiền phòng',
          price: rate.rate,
        },
        quantity: rate.quantity,
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
  }
  update(ol: OrderLine) {
    ol.total = ol.quantity! * ol.product?.price!;
    if (ol.id) {
      this.orderLineService.updateItem(ol).then((_) =>
        this.paymentService.getByOrderLineId(ol.id!).then((p) => {
          p.amount = ol.total ?? 0;
          this.paymentService.updateItem(p);
        })
      );
      this.getOrderLines();
    } else {
      let index = this.orderLines.findIndex((x) => x == ol);
      if (index != -1) {
        this.orderLines[index].quantity = ol.quantity;
        this.orderLines[index].total = ol.total;
      }
    }
  }

  remove(ol: OrderLine) {
    if (!ol.id) return;
    this.orderLineService
      .deleteItem(ol.id)
      .then((_) => this.paymentService.deleteByOrderLineId(ol.id!));
    this.getOrderLines();
  }
  async checkOut() {
    await this.checkOutCustomersAsync();
    this.addHourlyRateOrderLine(true);
    this.updateOrder();
    this.updateRoom();
    this.playReminderSound();
    this.router.navigate(['/home']);
    // this.print();
  }

  getRates(): Rate[] {
    var timeDiff = Utils.getTimeDiff(this.order?.checkInTime!);
    var rates: Rate[] = [];
    var extraRate;
    let dailyRate = this.getDailyRate();
    if (timeDiff.hours! > 5) {
      dailyRate.quantity ++;
    } else {
    if (timeDiff.days! > 0) {
        extraRate = this.getExtraRate(timeDiff);
      } else {
        extraRate = this.getHourlyRate(timeDiff);
      }
    }
    if(dailyRate.quantity > 0) {
      rates.push(dailyRate);
    }
    if(extraRate){
      if(extraRate.quantity > 1) {
        rates.push({rate: extraRate.rate, quantity: 1});
        var diff:TimeDiff = {days: timeDiff.days, hours: timeDiff.hours!-1, minutes: timeDiff.minutes};
        var eRate = this.getExtraRate(diff);
        rates.push(eRate);
      } else {
         rates.push(extraRate);
      }
    }
    return rates;
  }
  private playReminderSound() {
    const audio = new Audio('assets/reminder.wav');
    audio.load();
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  }
  getHourlyRate(timeDiff: TimeDiff): Rate {
    if (timeDiff.hours! > 5) {
      return {
        rate: this.room.rate!,
        quantity: 1,
      }
      ;
    }
    else {
      const rate = this.room.type == RoomType.VIP ? HourlyRate.VIP : HourlyRate.NORMAL_OR_DELUXE;
      var hourlyRate: Rate = { rate: rate, quantity: timeDiff.hours! };
      if (timeDiff.minutes! > 20) {
        hourlyRate.quantity ++;
      }
      return hourlyRate;
    }
  }

  getExtraRate(timeDiff: TimeDiff): Rate{
     if (timeDiff.hours! > 5) {
      return {
        rate: this.room.rate!,
        quantity: 1,
      }
      ;
    } else {
        const extra = this.room.type == RoomType.VIP ? 30_000 : 20_000;
        var rate: Rate = { rate: extra, quantity: timeDiff.hours! };
        if (timeDiff.minutes! > 20) {
          rate.quantity ++;
        }
        return rate
    }
  }
  getDailyRate(): Rate{
    let checkInTime = new Date(this.order?.checkInTime!);
    const year = checkInTime.getFullYear()!;
    const month = checkInTime.getMonth();
    let date = checkInTime.getDate();
    const hour = checkInTime.getHours();
    if (hour >= 0 && hour <= 6) {
      date--;
    }
    const start = new Date(year, month, date, 12, 0, 0).getTime();
    const diff = Utils.getTimeDiff(start);
    return { rate: this.room.rate!, quantity: diff.days! };
  }
  print() {
    this.isPrinting = true;
    setTimeout(() => {
      const printOptions = new PrintOptions({
        useExistingCss: true,
        printSectionId: 'print-section',
      });
      this.printService.print(printOptions);
      this.isPrinting = false;
    }, 1);
  }
}
