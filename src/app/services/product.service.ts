import { inject, Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Product } from '../models/product';
import { CollectionName } from '../models/const';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends CloudFirestoreService<Product> {
  constructor() {
    super(CollectionName.PRODUCT);
    this.seedData();
  }
  private async seedData() {
    const products = await this.getItems();
    if (products.length > 0) {
      return;
    }
    const newProducts: Product[] = [
      {
        name: 'Giá phòng',
        price: 80_000,
        description: 'Giá phòng giờ',
        id: 'hourly_rate',
      },
      { name: 'Nước suối ', price: 10_000, description: 'Nước suối đóng chai' },
      { name: 'Nước ngọt 15K', price: 15_000, description: 'Nước ngọt 15K' },
      { name: 'Nước ngọt 20K', price: 20_000, description: 'Nước ngọt 20K' },
      { name: 'Bia Tiger', price: 20_000, description: 'Bia Tiger' },
      { name: 'Bia Heineken', price: 25_000, description: 'Bia Heineken' },
      { name: 'Bia Saigon', price: 18_000, description: 'Bia Sai Gon' },
    ];
    newProducts.forEach((product) => {
      this.addItem(product).catch((error) => {
        console.error('Error seeding data:', error);
      });
    });
  }
}
