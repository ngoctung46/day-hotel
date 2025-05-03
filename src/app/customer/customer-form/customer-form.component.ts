import {
  AfterViewChecked,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
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
import {
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';
import {
  concatWith,
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
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'customer-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    NgbTypeaheadModule,
    NgbDatepickerModule,
    NgxPrintModule,
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css',
})
export class CustomerFormComponent implements OnInit {
  @Output() submittedCustomer: EventEmitter<Customer> = new EventEmitter();
  @Input() roomId: string = '';
  @Input() customerId: string = '';
  checkInDate: any;
  checkInTime: any;
  customer: Customer | undefined;
  room: Room | undefined;
  orderId = '';
  customerForm: FormGroup;
  customerService = inject(CustomerService);
  orderService = inject(OrderService);
  orderLineService = inject(OrderLineService);
  isNew = true;
  constructor(private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      idNumber: ['', Validators.required],
      issuedPlace: ['Cục Cảnh sát'],
      issuedDate: [''],
      birthDate: ['', Validators.required],
      birthPlace: [''],
      nationality: ['Việt Nam'],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      country: ['Việt Nam'],
      phone: [''],
    });
    const today = new Date(Date.now());
    const month =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : `${today.getMonth() + 1}`;
    const day =
      today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;
    const hour =
      today.getHours() >= 10 ? `${today.getHours()}` : `0${today.getHours()}`;
    const min =
      today.getMinutes() >= 10
        ? `${today.getMinutes()}`
        : `0${today.getMinutes()}`;

    this.checkInDate = `${today.getFullYear()}-${month}-${day}`;
    this.checkInTime = `${hour}:${min}`;
  }

  ngOnInit() {
    if (this.customerId) {
      this.customerService.getItemById(this.customerId).then((c) => {
        this.customer = c;
        this.initData();
      });
      if ((this.roomId = '')) this.isNew = true;
    }
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
    if (!this.customer?.id) this.customer = this.customerForm.value as Customer;
    this.customer.checkInTime = new Date(
      `${this.checkInDate}T${this.checkInTime}:00`
    ).getTime();
    this.submittedCustomer.emit(this.customer);
  }
  onClear() {
    this.customerForm.reset();
  }

  valueChange(newValue: string) {
    if (newValue.length < 12) return;
    this.customerService.getCustomerByIdNumber(newValue).then((c) => {
      if (c) {
        this.customer = c;
        this.initData();
        this.customerForm.disable();
      }
    });
  }

  private initData() {
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
    if (this.customer != undefined) this.customerForm.disable();
  }
}
