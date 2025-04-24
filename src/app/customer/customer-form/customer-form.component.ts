import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Customer } from '../../models/customer';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Room } from '../../models/room';
import { JsonPipe } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
} from 'rxjs';
import { PROVINCES } from '../../models/const';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { OrderLineService } from '../../services/order-line.service';

@Component({
  selector: 'customer-form',
  imports: [NgbTypeaheadModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css',
})
export class CustomerFormComponent {
  @Output() finished: EventEmitter<boolean> = new EventEmitter();
  @Input() room: Room = {};
  @Input() customer: Customer | undefined = {
    firstName: '',
    lastName: '',
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
    this.addCustomer();
    this.addOrder();
    this.updateRoom();
    this.finished.emit(true);
  }
  onSelect(event: any): void {
    this.customer = event.item as unknown as Customer;
    this.customer.issuedDate = this.customer.issuedDate.toDate();
    this.customer.birthDate = this.customer.birthDate.toDate();
    this.customer.expiredDate = this.customer.expiredDate.toDate();
    this.setForm();
  }
  onClear() {
    this.finished.emit(true);
  }
  private setForm() {
    this.customerForm = this.fb.group({
      firstName: [this.customer?.firstName, Validators.required],
      lastName: [this.customer?.lastName, Validators.required],
      idNumber: [this.customer?.idNumber, Validators.required],
      issuedDate: [this.customer?.issuedDate, Validators.required],
      expiredDate: [this.customer?.expiredDate, Validators.required],
      issuedPlace: [this.customer?.issuedPlace, Validators.required],
      birthDate: [this.customer?.birthDate, Validators.required],
      birthPlace: [this.customer?.birthPlace, Validators.required],
      nationality: [this.customer?.nationality, Validators.required],
      addressLine1: [this.customer?.addressLine1],
      addressLine2: [this.customer?.addressLine2],
      city: [this.customer?.city],
      country: [this.customer?.country],
      phone: [this.customer?.phone],
    });
  }

  addCustomer() {}
  addOrder() {
    const checkInTime = new Date().getTime();
    this.orderService.addItem({
      roomId: this.room.id,
      customerId: this.customer?.id,
      checkInTime,
      orderLineIds: [],
    }).then((orderId) => {
      this.orderLineService.addItem({
        
      })
    });
  }
  updateRoom() {
    // this.fs.updateRoom(this.roomId, {
    //   customerId: this.customer.idNumber,
    //   orderId: this.orderId,
    //   occupied: true,
    //   status: RoomStatus.Clean,
    // });
  }
}
