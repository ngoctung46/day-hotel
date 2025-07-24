import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { CloudFirestoreService } from './cloud-firestore.service';
import { CollectionName } from '../models/const';
import { collection, getDocs, orderBy, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends CloudFirestoreService<Customer> {
  constructor() {
    super(CollectionName.CUSTOMER);
  }
  async getCustomerByIdNumber(idNumber: string): Promise<Customer | undefined> {
    const customer = await this.getItems().then((customers) =>
      customers.find((c) => c.idNumber == idNumber)
    );
    return customer;
  }
  async getCustomers(from?: Date, to?: Date) {
      const orderRef = collection(this.firestore, this.collectionName);
      const fromDate = from?.getTime() ?? 0;
      const toDate = to?.getTime() ?? 0;
      const q = query(
        orderRef,
        where('checkInTime', '>=', fromDate),
        where('checkInTime', '<=', toDate),
        orderBy('checkInTime', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Customer)
      );
      return items.sort((a, b) => a.checkInTime! - b.checkInTime!);
    }
}
