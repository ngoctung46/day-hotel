import { ModelBase } from './model-base';
import { Product } from './product';

export interface OrderLine extends ModelBase {
  orderId?: string;
  customerId?: string;
  productId?: string;
  product?: Product;
  quantity?: number;
}
