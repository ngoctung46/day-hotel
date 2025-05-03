import { PaymentType } from "./const";
import { ModelBase } from "./model-base";
import { Room } from "./room";

export interface Payment extends ModelBase {
  name: string;
  type: PaymentType;
  amount: number;
  roomId?: string;
  room?: Room;
  orderLineId?: string;
}
