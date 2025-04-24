import { Component, inject, Input } from '@angular/core';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { JsonPipe } from '@angular/common';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
@Component({
  selector: 'app-customer',
  imports: [CustomerFormComponent, JsonPipe],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  roomService = inject(RoomService);
  customerService = inject(CustomerService);
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

  ngOnInit() {}
}
