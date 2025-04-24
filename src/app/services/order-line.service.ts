import { inject, Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { OrderLine } from '../models/order-line';
import { CollectionName } from '../models/const';

@Injectable({
  providedIn: 'root',
})
export class OrderLineService extends CloudFirestoreService<OrderLine> {
  constructor() {
    super(CollectionName.ORDER_LINE);
  }

  async getOrderLinesByOrderId(orderId: string): Promise<OrderLine[]> {
    const items = await this.getItems();
    return items.filter((orderLine) => orderLine.orderId === orderId);
  }
}
