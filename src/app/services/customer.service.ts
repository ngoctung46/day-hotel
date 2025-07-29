import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { CloudFirestoreService } from './cloud-firestore.service';
import { CollectionName } from '../models/const';
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Room } from '../models/room';

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
    const customerRef = collection(this.firestore, this.collectionName);
    const fromDate = from?.getTime() ?? 0;
    const toDate = to?.getTime() ?? 0;
    const q = query(
      customerRef,
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
  async getCustomersInRoom(room: Room) {
    if (!room.extraCustomerIds || room.extraCustomerIds.length === 0) {
      return [];
    }
    const customerRef = collection(this.firestore, this.collectionName);
    const q = query(
      customerRef,
      where('id', 'in', room.extraCustomerIds),
      orderBy('checkInTime', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Customer)
    );
  }
  async updateCustomersCheckOutTime(
    room: Room,
    checkOutTime: number
  ): Promise<void> {
    const customers = await this.getCustomersInRoom(room);
    for (const customer of customers) {
      customer.checkOutTime = checkOutTime;
      await this.updateItem(customer);
    }
  }
}
