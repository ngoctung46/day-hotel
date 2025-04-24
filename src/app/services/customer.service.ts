import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { CloudFirestoreService } from './cloud-firestore.service';
import { CollectionName } from '../models/const';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends CloudFirestoreService<Customer> {
  constructor() {
    super(CollectionName.CUSTOMER);
  }
  async getCustomerByIdNumber(idNumber: string): Promise<Customer | undefined> {
    const customers = await this.getItems();
    return (
      customers.find((customer) => customer.idNumber === idNumber) ?? undefined
    );
  }
}
