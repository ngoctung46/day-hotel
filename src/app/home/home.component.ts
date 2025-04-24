import { Component, inject } from '@angular/core';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-home',
  imports: [RoomsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  rooms: Room[] = [];
  roomService = inject(RoomService);
  productService = inject(ProductService);
  constructor() {
    this.roomService
      .getItems()
      .then(
        (rooms) => (this.rooms = rooms.sort((a, b) => a.number! - b.number!))
      );
  }
}
