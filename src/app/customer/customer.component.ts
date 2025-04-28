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
  rId = '';
  cId = '';
  @Input() set roomId(id: string) {
    this.rId = id;
  }

  @Input() set id(id: string) {
    this.cId = id;
  }

  constructor(private router: Router) {}
  ngOnInit() {}
  async saveCustomerAsync(customer: Customer) {
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
        roomId: this.rId,
        checkInTime: Date.now(),
        orderLineIds: [orderLineRef.id],
      },
      orderRef
    );
    if (!customer.id) {
      await this.customerService
        .addItem(customer, customerRef)
        .then((_) => (customer.id = customerRef.id));
    }

    this.roomService
      .updateItem({
        id: this.rId,
        customerId: customer.id,
        orderId: orderRef.id,
        status: RoomStatus.CHECKED_IN,
      })
      .then(() => {
        this.router.navigate(['/home']);
      });
  }
}
