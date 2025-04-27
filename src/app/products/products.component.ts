import { Component, inject } from '@angular/core';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [EditComponent, ListComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  productServicer = inject(ProductService);
  products: Product[] = [];
  constructor() {
    this.getProducts();
  }

  private getProducts() {
    this.productServicer.getItems().then(
      (products) =>
        (this.products = products.sort((a, b) => {
          if (a?.name!.toUpperCase() > b?.name!.toUpperCase()) return 1;
          if (a?.name!.toUpperCase() < b?.name!.toUpperCase()) return -1;
          return 0;
        }))
    );
  }

  loadProducts() {
    this.getProducts();
  }
}
