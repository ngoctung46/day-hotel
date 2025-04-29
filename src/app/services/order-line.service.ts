import { inject, Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { OrderLine } from '../models/order-line';
import { CollectionName, ProductType } from '../models/const';
import { collection, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OrderLineService extends CloudFirestoreService<OrderLine> {
  constructor() {
    super(CollectionName.ORDER_LINE);
  }

  async getOrderLinesByOrderId(orderId: string): Promise<OrderLine[]> {
    const orderLineRef = collection(this.firestore, this.collectionName);
    const q = query(orderLineRef, where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);
    const items: OrderLine[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as OrderLine)
    );
    return items;
  }
  async getHourlyOrderLine(): Promise<OrderLine | undefined> {
    const item = await this.getItems().then((ol) =>
      ol.find((x) => x.product?.type == ProductType.ROOM_RATE)
    );
    return item;
  }
}
