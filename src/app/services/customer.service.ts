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
import * as XLSX from 'xlsx';
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
  public exportCustomersToExcel<T = any>(
    items: T[],
    columns?: ColumnDef<T>[],
    fileName = 'export'
  ) {
    if (!items || items.length === 0) return;

    // default columns when none provided
    const defaultColumns: ColumnDef[] = [
      { header: 'Tên', key: 'name' },
      { header: 'Số giấy tờ', key: 'idNumber' },
      { header: 'Ngày sinh', key: 'birthDate' },
      { header: 'Phòng', key: 'room' },
      {
        header: 'Vào',
        key: 'checkInTime',
        transform: (v) => (v ? new Date(v).toLocaleString() : ''),
      },
      {
        header: 'Ra',
        key: 'checkOutTime',
        transform: (v) => (v ? new Date(v).toLocaleString() : ''),
      },
    ];

    const cols = columns && columns.length ? columns : defaultColumns;

    const headerRow = cols.map((c) => c.header);
    const dataRows = items.map((item) =>
      cols.map((c) => {
        const raw = this.getValue(item, c.key);
        return c.transform ? c.transform(raw, item) : raw ?? '';
      })
    );

    const aoa = [headerRow, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(
      wb,
      `${fileName}_${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`
    );
  }
  private getValue(obj: any, path: string) {
    if (!path) return undefined;
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
  }
}
export type ColumnDef<T = any> = {
  header: string;
  key: string; // dot path allowed, e.g. "customer.name" or "checkInTime"
  transform?: (value: any, row?: T) => any; // optional formatter
};
