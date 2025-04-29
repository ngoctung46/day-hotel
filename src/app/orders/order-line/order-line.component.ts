import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { OrderLine } from '../../models/order-line';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { CommonModule, JsonPipe } from '@angular/common';
import { OrderLineService } from '../../services/order-line.service';
import { ProductService } from '../../services/product.service';
import { ProductType } from '../../models/const';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'orders-order-line',
  imports: [FormsModule, CommonModule],
  templateUrl: './order-line.component.html',
  styleUrl: './order-line.component.css',
})
export class OrderLineComponent {
  @Output() added: EventEmitter<boolean> = new EventEmitter();
  @Input() orderId = '';
  orderLineService = inject(OrderLineService);
  productService = inject(ProductService);
  orderService = inject(OrderService);
  orderLine: OrderLine = { quantity: 1 };
  products: Product[] = [];
  selectedProduct: Product = {};
  constructor() {
    this.productService.getItems().then(
      (products) =>
        (this.products = products
          .sort((a, b) => a.type! - b.type!)
          .sort((a, b) => {
            if (a?.name!.toUpperCase() > b?.name!.toUpperCase()) return 1;
            if (a?.name!.toUpperCase() < b?.name!.toUpperCase()) return -1;
            return 0;
          })
          .filter((x) => x.type != ProductType.ROOM_RATE))
    );
  }
  addOrderLine() {
    this.orderLine.product = this.selectedProduct;
    this.orderLine.productId = this.selectedProduct.id;
    this.orderLine.total =
      this.orderLine?.product?.price! * this.orderLine?.quantity!;
    this.orderLine.orderId = this.orderId;
    if (this.orderId == '') return;
    this.orderLineService
      .addItem(this.orderLine)
      .then((_) => this.added.emit(true));
  }
}
