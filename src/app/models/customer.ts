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
  address?: string; // Added for customer address
  tagNumber?: string; // Added for vehicle number plate
}
