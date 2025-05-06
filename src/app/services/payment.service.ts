import { Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Payment } from '../models/payment';
import { CollectionName, PaymentType } from '../models/const';
import { filter, from } from 'rxjs';
import { collection, getDocs, query, where } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends CloudFirestoreService<Payment> {
  constructor() {
    super(CollectionName.PAYMENT);
    // this.seedData();
  }

  async getPaymentsByDateAsync(
    fromDate?: Date,
    toDate?: Date
  ): Promise<Payment[]> {
    const payments = await this.getItems().then((payments) =>
      payments.filter((x) => {
        let createdAt = new Date(x?.createdAt!);
        fromDate?.setHours(0, 0, 0);
        toDate?.setHours(23, 59, 59);
        return createdAt >= fromDate! && createdAt <= toDate!;
      })
    );
    return payments;
  }

  async getPrepaids(from?: Date, to?: Date): Promise<Payment[]> {
    const paymentRef = collection(this.firestore, this.collectionName);
    const q = query(paymentRef, where('type', '==', PaymentType.PREPAID));
    const querySnapshot = await getDocs(q);
    const items: Payment[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Payment)
    );
    return items.filter((x) => {
      let createdAt = new Date(x?.createdAt!);
      return createdAt >= from! && createdAt <= to!;
    });
  }
  async deleteByOrderLineId(id: string) {
    await this.getByOrderLineId(id).then((p) => this.deleteItem(p.id!));
  }

  async getByOrderLineId(id: string): Promise<Payment> {
    const paymentRef = collection(this.firestore, this.collectionName);
    const q = query(paymentRef, where('orderLineId', '==', id));
    const querySnapshot = await getDocs(q);
    const item: Payment = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Payment)
    )[0];
    return item;
  }
}
