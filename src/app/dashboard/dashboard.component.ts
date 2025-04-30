import { Component, inject, OnInit } from '@angular/core';
import { RoomStatus } from '../models/const';
import { Room } from '../models/room';
import { RoomService } from '../services/room.service';
import { Order } from '../models/order';
import { StatusComponent } from './status/status.component';

@Component({
  selector: 'app-dashboard',
  imports: [StatusComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {}
}
