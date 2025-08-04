import { Customer } from './customer';
import { ModelBase } from './model-base';

export interface CustomerHistories extends ModelBase {
  customerId?: string;
  roomId?: string;
  roomNumber?: number;
  orderId?: string;
  customer?: Customer;
  checkInTime?: number; // Timestamp in milliseconds
  checkOutTime?: number; // Timestamp in milliseconds
}
