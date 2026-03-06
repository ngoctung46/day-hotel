import { Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Order } from '../models/order';
import { CollectionName } from '../models/const';
import { TimeDiff } from '../models/time-diff';
import * as XLSX from 'xlsx';

import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends CloudFirestoreService<Order> {
  constructor() {
    super(CollectionName.ORDER);
  }

  async getOrders(from?: Date, to?: Date) {
    const orderRef = collection(this.firestore, this.collectionName);
    const fromDate = from?.getTime() ?? 0;
    const toDate = to?.getTime() ?? 0;
    const q = query(
      orderRef,
      where('checkOutTime', '>=', fromDate),
      where('checkOutTime', '<=', toDate),
      orderBy('checkOutTime', 'desc'),
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Order,
    );
    return items.sort((a, b) => a.checkOutTime! - b.checkOutTime!);
  }
  public exportOrdersToExcel<T = any>(
    items: T[],
    columns?: ColumnDef<T>[],
    fileName = 'BC_Doanh_thu',
  ) {
    if (!items || items.length === 0) return;

    // default columns when none provided
    const defaultColumns: ColumnDef[] = [
      {
        header: 'Thời Gian',
        key: 'checkOutTime',
        transform: (v) => (v ? new Date(v).toLocaleString() : ''),
      },
      { header: 'Phòng', key: 'roomId' },
      { header: 'Mã hóa đơn', key: 'id' },
      { header: 'Thành tiền', key: 'total' },
    ];

    const cols = columns && columns.length ? columns : defaultColumns;

    const headerRow = cols.map((c) => c.header);
    const dataRows = items.map((item) =>
      cols.map((c) => {
        const raw = this.getValue(item, c.key);
        return c.transform ? c.transform(raw, item) : (raw ?? '');
      }),
    );

    const aoa = [headerRow, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(
      wb,
      `${fileName}_${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`,
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
