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
    let orderRef = this.orderService.createDoc();
    customer.orderId = orderRef.id;
    await this.orderService.addItem(
      {
        customerId: customerRef.id,
        roomId: customer.roomId,
        checkInTime: customer.checkInTime,
        orderLineIds: [],
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
        id: this.rId ?? customer.roomId,
        customerId: customer.id,
        orderId: orderRef.id,
        status: RoomStatus.CHECKED_IN,
      })
      .then(() => {
        this.router.navigate(['/home']);
      });
  }
}
