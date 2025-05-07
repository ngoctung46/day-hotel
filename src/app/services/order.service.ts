import { Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Order } from '../models/order';
import { CollectionName } from '../models/const';
import { TimeDiff } from '../models/time-diff';
import { collection, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends CloudFirestoreService<Order> {
  constructor() {
    super(CollectionName.ORDER);
  }

  async getOrders(from?: Date, to?: Date) {
    const orderRef = collection(this.firestore, this.collectionName);
    const fromDate = from?.getTime() ?? 0;
    const toDate = to?.getTime() ?? 0;
    const q = query(
      orderRef,
      where('checkOutTime', '>=', fromDate),
      where('checkOutTime', '<=', toDate)
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Order)
    );
    return items.sort((a, b) => a.checkOutTime! - b.checkOutTime!);
  }
}
