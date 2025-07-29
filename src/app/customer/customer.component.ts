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
import { CustomerListComponent } from './customer-list/customer-list.component';
@Component({
  selector: 'app-customer',
  imports: [CustomerFormComponent, CommonModule, CustomerListComponent],
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
  edittable = false;
  customers: Customer[] = [];
  @Input() set roomId(id: string) {
    this.rId = id;
  }

  constructor(private router: Router) {}
  async ngOnInit() {
    await this.getCustomersByRoomIdAsync();
   }
  async saveCustomersAsync(customers: Customer[]) {
    if (customers.length === 0) return;
    let orderRef = this.orderService.createDoc();
    let customerIds: string[] = [];

    customers.forEach(async (customer) => {
      let customerRef = this.customerService.createDoc();
      customer.orderId = orderRef.id;
      if (!customer.id) {
        customer.id = customerRef.id;
        await this.customerService.addItem(customer, customerRef).then((_) => {
          customerIds.push(customerRef.id);
        });
      } else {
        await this.customerService.updateItem(customer).then((_) => {
          customerIds.push(customer.id ?? '');
        });
      }
    });
    await this.orderService.addItem(
      {
        extraCustomerIds: customerIds,
        roomId: customers[0].roomId,
        checkInTime: customers[0].checkInTime,
        orderLineIds: [],
      },
      orderRef
    );
    this.roomService
      .updateItem({
        id: this.rId ?? customers[0].roomId,
        customerId: customers[0].id,
        orderId: orderRef.id,
        status: RoomStatus.CHECKED_IN,
        extraCustomerIds: customerIds,
      })
      .then(() => {
        this.router.navigate(['/home']);
      });
  }
  async getCustomersByRoomIdAsync() {
    if (!this.rId) return;
    await this.roomService.getItemById(this.rId).then(async (r) => {
      if (r) {
        await this.customerService.getCustomersInRoom(r).then((customers) => {
          this.customers = customers;
          this.edittable = true;
        });
      }
    });
  }
}
