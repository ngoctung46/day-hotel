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

  private seedData() {
    this.getItems().then((rooms) => {
      if (rooms.length <= 0) {
        for (let i = 1; i <= 2; i++) {
          for (let j = 1; j <= 3; j++) {
            this.addItem({
              number: i * 100 + j,
              rate: RoomRate.DELUXE,
              type: RoomType.NORMAL,
              occupied: false,
              status: RoomStatus.AVAILABLE,
            }).then();
          }
        }
      }
    });
  }
}
