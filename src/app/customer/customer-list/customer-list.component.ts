import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Customer } from '../../models/customer';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { RouterModule } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-list',
  imports: [DatePipe, FormsModule, RouterModule, NgbTooltip],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
})
export class CustomerListComponent {
  @Input() customers: Customer[] = [];
  @Input() active = true;
  @Output() delete: EventEmitter<Customer> = new EventEmitter();
  customerService = inject(CustomerService);
  deleteCustomer(customer: Customer) {
    this.delete.emit(customer);
  }
  async updateCustomerAsync(customer: Customer) {
    await this.customerService.updateItem(customer);
  }
}
