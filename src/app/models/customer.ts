import { ModelBase } from './model-base';

export interface Customer extends ModelBase {
  name?: string;
  idNumber?: string;
  birthDate?: any;
  checkInTime?: number;
  checkOutTime?: number;
  roomId?: string;
  orderId?: string;
  phone?: string;
  room?: number;
}
