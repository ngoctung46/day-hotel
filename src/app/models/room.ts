import { RoomStatus, RoomType } from './const';
import { ModelBase } from './model-base';

export interface Room extends ModelBase {
  number?: number;
  rate?: number;
  type?: RoomType;
  status?: RoomStatus;
  orderId?: string;
  customerId?: string;
}
