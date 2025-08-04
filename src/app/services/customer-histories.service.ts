import { inject, Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { CustomerHistories } from '../models/customer-histories';
import { CollectionName } from '../models/const';
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Customer } from '../models/customer';
import { Room } from '../models/room';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerHistoriesService extends CloudFirestoreService<CustomerHistories> {
  customerService = inject(CustomerService);
  constructor() {
    super(CollectionName.CUSTOMER_HISTORIES);
  }

  async getHistories(from?: Date, to?: Date) {
    const historiesRef = collection(this.firestore, this.collectionName);
    const fromDate = from?.getTime() ?? 0;
    const toDate = to?.getTime() ?? 0;
    const q = query(
      historiesRef,
      where('checkInTime', '>=', fromDate),
      where('checkInTime', '<=', toDate),
      orderBy('checkInTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as CustomerHistories)
    );

    // Fetch customer for each history
    const itemsWithCustomer = await Promise.all(
      items.map(async (history) => {
        if (history.customerId) {
          history.customer = await this.customerService.getItemById(
            history.customerId
          );
        }
        return history;
      })
    );
    return itemsWithCustomer.sort(
      (a, b) => b.customer?.checkInTime! - a.customer?.checkInTime!
    );
  }
}
