import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
} from '@angular/fire/firestore';
import { ModelBase } from '../models/model-base';

@Injectable({
  providedIn: 'root',
})
export abstract class CloudFirestoreService<T extends ModelBase> {
  firestore = inject(Firestore);
  constructor(private collectionName: string) {}
  async addItem(item: T): Promise<string> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(itemsCollection, item);
    return docRef.id;
  }

  async getItems(): Promise<T[]> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(itemsCollection);
    const items: T[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as T)
    );
    return items;
  }

  async updateItem(item: T): Promise<string> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(itemsCollection, item);
    return docRef.id;
  }

  async deleteItem(item: T): Promise<string> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(itemsCollection, item);
    return docRef.id;
  }
  async getItemById(id: string): Promise<T | undefined> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(itemsCollection);
    const item: T | undefined = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as T))
      .find((item) => item.id === id);
    return item;
  }
}
