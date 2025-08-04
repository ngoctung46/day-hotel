import { inject, Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Room } from '../models/room';
import {
  CollectionName,
  RoomRate,
  RoomStatus,
  RoomType,
} from '../models/const';
import { Rate } from '../models/rate';
import { CustomerService } from './customer.service';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends CloudFirestoreService<Room> {
  customerService = inject(CustomerService);
  constructor() {
    super(CollectionName.ROOM);
    // this.seedData();
  }

  private async seedData() {
    const rooms = await this.getItems();
    if (rooms.length > 0) {
      return;
    }
    const newRooms: Room[] = [
      {
        number: 101,
        rate: RoomRate.DELUXE,
        type: RoomType.DELUXE,
        status: RoomStatus.AVAILABLE,
      },
      {
        number: 102,
        rate: RoomRate.NORMAL,
        type: RoomType.NORMAL,
        status: RoomStatus.AVAILABLE,
      },
      {
        number: 103,
        rate: RoomRate.VIP,
        type: RoomType.VIP,
        status: RoomStatus.AVAILABLE,
      },
      {
        number: 201,
        rate: RoomRate.DELUXE,
        type: RoomType.DELUXE,
        status: RoomStatus.AVAILABLE,
      },
      {
        number: 202,
        rate: RoomRate.NORMAL,
        type: RoomType.NORMAL,
        status: RoomStatus.AVAILABLE,
      },
      {
        number: 203,
        rate: RoomRate.VIP,
        type: RoomType.VIP,
        status: RoomStatus.AVAILABLE,
      },
      {
        number: 301,
        rate: RoomRate.NORMAL,
        type: RoomType.DELUXE,
        status: RoomStatus.AVAILABLE,
      },
      {
        number: 302,
        rate: RoomRate.VIP,
        type: RoomType.VIP,
        status: RoomStatus.AVAILABLE,
      },
    ];
    newRooms.forEach((room) => {
      this.addItem(room).catch((error) => {
        console.error('Error seeding data:', error);
      });
    });
  }
  sumRates(rates: Rate[]): Rate[] {
    const rateMap = new Map<number, number>();

    for (const rateItem of rates) {
      rateMap.set(
        rateItem.rate,
        (rateMap.get(rateItem.rate) || 0) + rateItem.quantity
      );
    }

    return Array.from(rateMap, ([rate, quantity]) => ({ rate, quantity }));
  }

  async getCustomersInRoom(room: Room) {
    if (!room.extraCustomerIds || room.extraCustomerIds.length === 0) {
      return [];
    }
    const customers = await Promise.all(
      room.extraCustomerIds.map((id) => this.customerService.getItemById(id))
    );
    return customers.filter((c) => !!c) as Customer[];
  }
  async getAllStayingCustomers() {
    const rooms = await this.getItems();
    const stayingCustomers: Customer[] = [];
    for (const room of rooms) {
      if (room.extraCustomerIds && room.extraCustomerIds.length > 0) {
        const customers = await this.getCustomersInRoom(room);
        stayingCustomers.push(...customers);
      }
    }
    return stayingCustomers;
  }
}
