import {
  Component,
  EventEmitter,
  inject,
  Injectable,
  Input,
  Output,
} from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Customer } from '../../models/customer';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Room } from '../../models/room';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
} from 'rxjs';
import { RouterModule } from '@angular/router';
import { PROVINCES } from '../../models/const';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { OrderLineService } from '../../services/order-line.service';

@Component({
  selector: 'customer-form',
  imports: [
    NgbTypeaheadModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    AsyncPipe,
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css',
})
export class CustomerFormComponent {
  @Output() submittedCustomer: EventEmitter<Customer> = new EventEmitter();
  @Input() room: Room = {};
  @Input() customer: Customer | undefined = {
    name: '',
    idNumber: '',
    issuedDate: '',
    expiredDate: '',
    issuedPlace: '',
    birthDate: '',
    birthPlace: '',
    nationality: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    phone: '',
  };
  orderId = '';
  customerForm: FormGroup = new FormGroup({});
  customerService = inject(CustomerService);
  orderService = inject(OrderService);
  orderLineService = inject(OrderLineService);
  customers$: Promise<Customer[]> = this.customerService.getItems();
  customerIds: string[] = [];
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.setForm();
  }
  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : PROVINCES.filter(
              (v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            ).slice(0, 10)
      )
    );
  onSubmit() {
    this.customer = this.customerForm.value as Customer;
    this.submittedCustomer.emit(this.customer);
  }
  onSelect(event: any): void {
    this.customer = event.item as unknown as Customer;
    this.customer.issuedDate = this.customer.issuedDate.toDate();
    this.customer.birthDate = this.customer.birthDate.toDate();
    this.customer.expiredDate = this.customer.expiredDate.toDate();
    this.setForm();
  }
  onClear() {
    this.customerForm.reset();
  }
  private setForm() {
    this.customerForm = this.fb.group({
      name: [this.customer?.name, Validators.required],
      idNumber: [this.customer?.idNumber, Validators.required],
      issuedPlace: [this.customer?.issuedPlace ?? 'Cục Cảnh sát'],
      issuedDate: [this.customer?.issuedDate],
      birthDate: [this.customer?.birthDate],
      birthPlace: [this.customer?.birthPlace],
      nationality: [this.customer?.nationality ?? 'Việt Nam'],
      addressLine1: [this.customer?.addressLine1],
      addressLine2: [this.customer?.addressLine2],
      city: [this.customer?.city],
      country: [this.customer?.country ?? 'Việt Nam'],
      phone: [this.customer?.phone],
    });
  }
  onChangeIdNumber() {
    let idNumber = this.customerForm.get('idNumber')?.value;
    if (idNumber && idNumber.length > 8) {
      this.customerService.getCustomerByIdNumber(idNumber).then((customer) => {
        if (customer) {
          this.customer = customer;
          this.customer.issuedDate = this.customer.issuedDate.toDate();
          this.customer.birthDate = this.customer.birthDate.toDate();
          this.customer.expiredDate = this.customer.expiredDate.toDate();
          //  this.setForm();
          this.customerForm.patchValue(this.customer);
          this.customerForm.disable();
        }
      });
    }
  }
}
