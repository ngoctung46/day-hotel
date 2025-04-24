import { Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Order } from '../models/order';
import { CollectionName } from '../models/const';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends CloudFirestoreService<Order> {
  constructor() {
    super(CollectionName.ORDER);
  }
}
