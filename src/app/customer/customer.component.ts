import { Component, inject, Input } from '@angular/core';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { CommonModule, JsonPipe } from '@angular/common';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { Router, RouterModule } from '@angular/router';
import { OrderLineService } from '../services/order-line.service';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { RoomStatus } from '../models/const';
@Component({
  selector: 'app-customer',
  imports: [CustomerFormComponent, CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  roomService = inject(RoomService);
  customerService = inject(CustomerService);
  orderLineService = inject(OrderLineService);
  orderService = inject(OrderService);
  productService = inject(ProductService);
  room: Room = {} as Room;
  customer: Customer | undefined;
  @Input() set roomId(id: string) {
    this.roomService.getItemById(id).then((room) => {
      this.room = room || ({} as Room);
    });
  }
  @Input() set id(id: string) {
    this.customerService.getItemById(id).then((customer) => {
      this.customer = customer || undefined;
    });
  }

  constructor(private router: Router) {}
  ngOnInit() {}
  async saveCustomerAsync($event: Customer) {
    let customerRef = this.customerService.createDoc();
    let orderLineRef = this.orderLineService.createDoc();
    let orderRef = this.orderService.createDoc();
    this.productService.getHourlyRate().then(async (p) => {
      await this.orderLineService.addItem(
        {
          orderId: orderRef.id,
          productId: p?.id,
          quantity: 1,
          product: p,
          total: 1 * p?.price!,
        },
        orderLineRef
      );
    });
    await this.orderService.addItem(
      {
        customerId: customerRef.id,
        roomId: this.room.id,
        checkInTime: Date.now(),
        orderLineIds: [orderLineRef.id],
      },
      orderRef
    );
    await this.customerService.addItem($event, customerRef);
    this.roomService
      .updateItem({
        id: this.room.id,
        customerId: customerRef.id,
        orderId: orderRef.id,
        status: RoomStatus.CHECKED_IN,
      })
      .then(() => {
        this.router.navigate(['/home']);
      });
  }
}
