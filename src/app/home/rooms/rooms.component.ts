import { Component, Input } from '@angular/core';
import { RoomComponent } from './room/room.component';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-rooms',
  imports: [RoomComponent, CommonModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
})
export class RoomsComponent {
  @Input() rooms: Room[] = [];
}
