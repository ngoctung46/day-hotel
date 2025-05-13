import { ModelBase } from './model-base';
import { Room } from './room';

export interface Booking extends ModelBase {
  roomId?: string;
  room?: Room;
  bookingDate?: number;
  prepaid?: number;
  contactInfo?: string;
}
