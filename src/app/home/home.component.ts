import { Component, inject } from '@angular/core';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomService } from '../services/room.service';
import { Room } from '../models/room';
@Component({
  selector: 'app-home',
  imports: [RoomsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  rooms: Room[] = [];
  roomService = inject(RoomService);
  constructor() {
    this.roomService.getItems().then((rooms) => (this.rooms = rooms));
  }
}
