import { ModelBase } from './model-base';
import { OrderLine } from './order-line';

export interface Order extends ModelBase {
  roomId?: string;
  checkInTime?: number;
  checkOutTime?: number;
  orderLineIds?: string[];
  orderLines?: OrderLine[];
  customerId?: string;
  total?: number;
  charges?: number;
  discount?: number;
  note?: string;
  extraCustomerIds?: string[];
}
