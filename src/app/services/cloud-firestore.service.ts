import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  updateDoc,
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

  async updateItem(item: any): Promise<void> {
    if (!item.id) {
      throw new Error('Item must have an id to be updated.');
    }
    const itemDocRef = doc(this.firestore, this.collectionName, item.id);
    await updateDoc(itemDocRef, item);
  }

  async deleteItem(id: string): Promise<void> {
    const itemDocRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(itemDocRef);
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
