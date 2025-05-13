import { Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Booking } from '../models/booking';
import { CollectionName } from '../models/const';
import { collection, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class BookingService extends CloudFirestoreService<Booking> {
  constructor() {
    super(CollectionName.BOOKING);
  }

  async getBookings(dateRange = 7) {
    const bookingRef = collection(this.firestore, this.collectionName);
    const from = new Date(Date.now());
    from.setHours(0, 0, 0);
    const to = new Date(Date.now());
    to.setDate(to.getDate() + dateRange);
    to.setHours(23, 59, 59);
    const q = query(
      bookingRef,
      where('bookingDate', '>=', from),
      where('bookingDate', '<=', to)
    );
    const querySnapshot = await getDocs(q);
    const items: Booking[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Booking)
    );
    return items;
  }
}
