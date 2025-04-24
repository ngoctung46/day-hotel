import { inject, Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Product } from '../models/product';
import { CollectionName, ProductType } from '../models/const';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends CloudFirestoreService<Product> {
  constructor() {
    super(CollectionName.PRODUCT);
    this.seedData();
  }

  async getHourlyRate(): Promise<Product | undefined> {
    return (await this.getItems()).find(
      (x) => x.type == ProductType.HOURLY_RATE
    );
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
        type: ProductType.HOURLY_RATE,
      },
      {
        name: 'Nước suối ',
        price: 10_000,
        description: 'Nước suối đóng chai',
        type: ProductType.BEVERAGES,
      },
      {
        name: 'Nước ngọt 15K',
        price: 15_000,
        description: 'Nước ngọt 15K',
        type: ProductType.BEVERAGES,
      },
      {
        name: 'Nước ngọt 20K',
        price: 20_000,
        description: 'Nước ngọt 20K',
        type: ProductType.BEVERAGES,
      },
      {
        name: 'Bia Tiger',
        price: 20_000,
        description: 'Bia Tiger',
        type: ProductType.BEVERAGES,
      },
      {
        name: 'Bia Heineken',
        price: 25_000,
        description: 'Bia Heineken',
        type: ProductType.BEVERAGES,
      },
      {
        name: 'Bia Saigon',
        price: 18_000,
        description: 'Bia Sai Gon',
        type: ProductType.BEVERAGES,
      },
    ];
    newProducts.forEach((product) => {
      this.addItem(product).catch((error) => {
        console.error('Error seeding data:', error);
      });
    });
  }
}
