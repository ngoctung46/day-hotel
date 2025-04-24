import { Component, inject, Input } from '@angular/core';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { JsonPipe } from '@angular/common';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { Router, RouterModule } from '@angular/router';
import { OrderLineService } from '../services/order-line.service';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { RoomStatus } from '../models/const';
@Component({
  selector: 'app-customer',
  imports: [CustomerFormComponent, JsonPipe],
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
  saveCustomer($event: Customer) {
    this.customer = $event;
    this.customerService.addItem(this.customer).then((id) => {
      this.productService.getHourlyRate().then((p) => {
        this.orderLineService
          .addItem({
            productId: p?.id,
            customerId: id,
            product: p,
            quantity: 1,
          })
          .then((olId) => {
            this.orderService.addItem({
              roomId: this.room.id,
              checkInTime: Date.now(),
              orderLineIds: [olId],
              customerId: id,
            });
          });
      });
    });
    this.router.navigate(['/home']);
  }
}
