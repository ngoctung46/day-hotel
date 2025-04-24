import { ModelBase } from "./model-base";

export interface Customer extends ModelBase {
  firstName: string;
  lastName: string;
  idNumber: string;
  issuedDate: any;
  expiredDate: any;
  issuedPlace: string;
  birthDate: any;
  birthPlace: string;
  nationality: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  country: string;
  phone: string;
}
