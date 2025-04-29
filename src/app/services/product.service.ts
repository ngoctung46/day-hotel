import { inject, Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Product } from '../models/product';
import { CollectionName, ProductType } from '../models/const';
import {
  collection,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends CloudFirestoreService<Product> {
  constructor() {
    super(CollectionName.PRODUCT);
    this.seedData();
  }

  async getRoomRateOrderLine(): Promise<Product[]> {
    const productRef = collection(this.firestore, this.collectionName);
    const q = query(
      productRef,
      where('type', '==', ProductType.ROOM_RATE),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    const items: Product[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Product)
    );
    return items;
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
        description: 'Giá phòng giờ/ngày',
        type: ProductType.ROOM_RATE,
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
