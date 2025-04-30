import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule, JsonPipe } from '@angular/common';
import { ProductTypePipe } from '../../pipes/product-type.pipe';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
})
export class ListComponent implements OnInit {
  productService = inject(ProductService);
  @Input() products: Product[] = [];
  @Output() edited: EventEmitter<boolean>;
  router = inject(Router);
  constructor() {
    this.edited = new EventEmitter();
  }
  ngOnInit(): void {}
  async deleteProductAsync(p: Product) {
    if (p.id != undefined) {
      await this.productService
        .deleteItem(p.id)
        .then(() => this.edited.emit(true));
    }
  }
  async updateProductAsync(p: Product) {
    if (p.id != undefined) {
      await this.productService
        .updateItem(p)
        .then(() => this.edited.emit(true));
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
