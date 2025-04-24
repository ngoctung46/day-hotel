import { Component, inject } from '@angular/core';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
import { ProductService } from '../services/product.service';
import { AsyncPipe, CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [RoomsComponent, CommonModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  rooms: Room[] = [];
  roomService = inject(RoomService);
  productService = inject(ProductService);
  rooms$: Promise<Room[]> = this.roomService.getItems();
  constructor() {}
}
