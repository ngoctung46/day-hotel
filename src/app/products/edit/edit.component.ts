import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { CommonModule, JsonPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'product-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent {
  productService = inject(ProductService);
  product: Product = { type: 0 };
  @Output() added: EventEmitter<boolean>;
  constructor() {
    this.added = new EventEmitter();
  }
  addProduct() {
    if (!this.product.id) {
      this.productService.addItem(this.product).then(() => {
        this.product.name = '';
        this.product.price = 0;
        this.added.emit(true);
      });
    } else {
    }
  }
  get valid() {
    return this.product.name?.length! > 1 && this.product?.price! != 0;
  }
}
