import { ModelBase } from "./model-base";

export interface Product extends ModelBase {
  name?: string;
  description?: string;
  price?: number;
}
