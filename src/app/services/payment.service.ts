import { Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Payment } from '../models/payment';
import { CollectionName } from '../models/const';
import { filter, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends CloudFirestoreService<Payment> {
  constructor() {
    super(CollectionName.PAYMENT);
    // this.seedData();
  }

  getPaymentsByDate(fromDate: Date, toDate: Date) {
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    toDate.setHours(23);
    toDate.setMinutes(59);
    this.getItems().then((payments) =>
      payments.filter((x) => {
        let createdAt = new Date(x?.createdAt!);
        return createdAt >= fromDate && createdAt <= toDate;
      })
    );
  }
}
