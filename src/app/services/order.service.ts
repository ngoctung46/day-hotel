import { Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Order } from '../models/order';
import { CollectionName } from '../models/const';
import { TimeDiff } from '../models/time-diff';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends CloudFirestoreService<Order> {
  constructor() {
    super(CollectionName.ORDER);
  }
  public getTimeDiff(checkInTime: number): TimeDiff {
    const now = new Date().getTime();
    const timeDiff = now - checkInTime;
    const seconds = Math.trunc(timeDiff / 1000);
    const minutes = Math.trunc(seconds / 60);
    const hours = Math.trunc(minutes / 60);
    const days = Math.trunc(hours / 24);
    return {
      days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
      totalHours: hours,
    };
  }
}
