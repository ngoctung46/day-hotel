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
  NgbDatepickerModule,
  NgbTooltip,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
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
import { format } from 'date-fns';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    OrderLineComponent,
    FormsModule,
    NgxPrintModule,
    NgbTooltip,
    NgbDatepickerModule,
    NgbTypeaheadModule,
  ],
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
  checkInDate: any;
  checkInTime: any;
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
      var checkInTime = new Date(order?.checkInTime!);
      this.checkInTime = format(checkInTime, 'HH:mm:ss');
      this.checkInDate = format(checkInTime, 'yyyy-MM-dd');
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
        }),
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

  save() {
    let checkInTime = new Date(
      `${this.checkInDate}T${this.checkInTime}:00`,
    ).getTime();
    if (this.order) {
      this.order.checkInTime = checkInTime;
      this.orderService.updateItem(this.order).then(() => {
        location.reload();
      });
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
    var dailyRate: Rate = { rate: 0, quantity: 0 };
    if (timeDiff.days! == 0) {
      if (timeDiff.hours! > 5) {
        dailyRate = this.getDailyRate();
        let diff = Utils.getDailyTimeDiff(this.order?.checkInTime!);
        if (diff.days! > 0) {
          if (diff.hours! < 6) {
            var extraRate = this.getExtraRate(diff);
            rates.push(extraRate);
          }
          // } else {
          // dailyRate.quantity += 1;
          // }
        }
        rates.push(dailyRate);
      } else {
        var hourlyRates = this.getHourlyRates(timeDiff);
        rates.push(...hourlyRates);
      }
    } else {
      dailyRate = this.getDailyRate();
      rates.push(dailyRate);
      let diff = Utils.getDailyTimeDiff(this.order?.checkInTime!);
      if (diff.hours! < 6) {
        var extraRate = this.getExtraRate(diff);
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
  getHourlyRates(timeDiff: TimeDiff): Rate[] {
    if (timeDiff.hours! > 5) {
      return [
        {
          rate: this.room.rate!,
          quantity: 1,
        },
      ];
    } else {
      const rate =
        this.room.type == RoomType.VIP
          ? HourlyRate.VIP
          : HourlyRate.NORMAL_OR_DELUXE;
      var rates: Rate[] = [];
      var hourRate: Rate = { rate: rate, quantity: timeDiff.hours! };
      if (timeDiff.minutes! > 20) {
        hourRate.quantity++;
      }
      if (hourRate.quantity! > 1) {
        rates.push({ rate: rate, quantity: 1 });
        var diff: TimeDiff = {
          hours: timeDiff.hours! - 1,
          minutes: timeDiff.minutes,
        };
        var additionalRate: Rate = this.getExtraRate(diff);
        rates.push(additionalRate);
      } else {
        rates.push(hourRate);
      }
    }
    return rates;
  }

  getExtraRate(timeDiff: TimeDiff): Rate {
    const extra = this.room.type == RoomType.VIP ? 30_000 : 20_000;
    var rate: Rate = { rate: extra, quantity: timeDiff.hours! };
    if (timeDiff.minutes! > 20) {
      rate.quantity++;
    }
    return rate;
  }
  getDailyRate(): Rate {
    let diff = Utils.getDailyTimeDiff(this.order?.checkInTime!);
    if (diff.hours! > 5) diff.days! += 1;
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
