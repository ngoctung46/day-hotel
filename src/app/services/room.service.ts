import { inject, Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Room } from '../models/room';
import {
  CollectionName,
  RoomRate,
  RoomStatus,
  RoomType,
} from '../models/const';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends CloudFirestoreService<Room> {
  constructor() {
    super(CollectionName.ROOM);
    this.seedData();
  }

  private async seedData() {
    const rooms = await this.getItems();
    if (rooms.length > 0) {
      return;
    }
    const newRooms: Room[] = [
      { number: 101, rate: RoomRate.DELUXE, type: RoomType.DELUXE, status: RoomStatus.AVAILABLE },
      { number: 102, rate: RoomRate.NORMAL, type: RoomType.NORMAL, status: RoomStatus.AVAILABLE },
      { number: 103, rate: RoomRate.VIP, type: RoomType.VIP, status: RoomStatus.AVAILABLE },
      { number: 201, rate: RoomRate.DELUXE, type: RoomType.DELUXE,  status: RoomStatus.AVAILABLE },
      { number: 202, rate: RoomRate.NORMAL, type: RoomType.NORMAL, status: RoomStatus.AVAILABLE },
      { number: 203, rate: RoomRate.VIP, type: RoomType.VIP, status: RoomStatus.AVAILABLE },
      { number: 301, rate: RoomRate.NORMAL, type: RoomType.DELUXE, status: RoomStatus.AVAILABLE },
      { number: 302, rate: RoomRate.VIP, type: RoomType.VIP, status: RoomStatus.AVAILABLE },
    ];
    newRooms.forEach((room) => {
      this.addItem(room).catch((error) => {
        console.error('Error seeding data:', error);
      });
    });
  }
}
