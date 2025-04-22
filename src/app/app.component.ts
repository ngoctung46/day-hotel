import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoomService } from './services/room.service';
import { Room } from './models/room';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'day-hotel';
  constructor() {}
}
