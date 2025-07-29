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
  FormArray,
} from '@angular/forms';
import { Customer } from '../../models/customer';
import {
  NgbDatepickerModule,
  NgbTooltip,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Room } from '../../models/room';
import { CommonModule } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
} from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { PROVINCES } from '../../models/const';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { OrderLineService } from '../../services/order-line.service';
import { NgxPrintModule } from 'ngx-print';
import { RoomService } from '../../services/room.service';
import { format } from 'date-fns';
import { CustomerListComponent } from '../customer-list/customer-list.component';
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
    NgbTooltip,
    CustomerListComponent,
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css',
})
export class CustomerFormComponent implements OnInit {
  @Output() checkedInCustomers: EventEmitter<Customer[]> = new EventEmitter();
  @Input() roomId: string = '';
  checkInDate: any;
  checkInTime: any;
  birthDate: any;
  room: Room | undefined;
  orderId = '';
  formBuilder = inject(FormBuilder);
  customerForm: FormGroup;
  customerService = inject(CustomerService);
  orderService = inject(OrderService);
  orderLineService = inject(OrderLineService);
  roomService = inject(RoomService);
  isNew = true;
  customers: Customer[] = [];
  constructor(private fb: FormBuilder, private router: Router) {
    this.birthDate = format(new Date(1900, 0, 1), 'yyyy-MM-dd');
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      idNumber: ['', Validators.required],
      birthDate: [
        this.birthDate,
        [Validators.required, this.birthDateAfter1900Validator],
      ],
      phone: [''],
    });
    const current = new Date();
    this.checkInDate = format(current, 'yyyy-MM-dd');
    this.birthDate = format(new Date(1900, 0, 1), 'yyyy-MM-dd');
    this.checkInTime = format(current, 'HH:mm');
  }

  ngOnInit() {
    if (this.roomId) {
      this.roomService.getItemById(this.roomId).then((r) => (this.room = r));
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
    this.checkIn();
    // if (this.roomId != '') this.addCustomer();
    // if (this.customerId != '') this.updateCustomer();
  }
  onClear() {
    this.customerForm.reset();
  }

  valueChange(newValue: string) {
    if (newValue.length < 6) return;
    this.customerService.getCustomerByIdNumber(newValue).then((c) => {
      if (c) {
        c.checkInTime = undefined;
        this.customers.push(c);
        this.customerForm.reset();
      }
    });
  }

  checkIn() {
    this.customers.forEach((element) => {
      element.roomId = this.roomId;
      element.room = this.room?.number;
      element.checkInTime = new Date(
        `${this.checkInDate}T${this.checkInTime}:00`
      ).getTime();
    });
    this.checkedInCustomers.emit(this.customers);
  }
  addCustomer() {
    const customer = this.customerForm.value as Customer;
    customer.roomId = this.roomId;
    customer.room = this.room?.number;
    this.customers.push(customer);
    this.customerForm.reset();
    this.customerForm.enable();
  }
  deleteCustomer(customer: Customer) {
    this.customers = this.customers.filter(
      (c) => c.idNumber !== customer.idNumber
    );
  }
  birthDateAfter1900Validator(
    control: import('@angular/forms').AbstractControl
  ) {
    const value = control.value;
    if (!value) return null;
    const date = new Date(value);
    const minDate = new Date(1900, 0, 2); // 1/1/1900 is not accepted, so use 1/2/1900
    return date >= minDate ? null : { birthDateTooEarly: true };
  }
}
