import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ModelBase } from '../models/model-base';

@Injectable({
  providedIn: 'root',
})
export abstract class CloudFirestoreService<T extends ModelBase> {
  firestore = inject(Firestore);
  constructor(protected collectionName: string) {}
  createDoc(): DocumentReference {
    return doc(collection(this.firestore, this.collectionName));
  }
  async addItem(
    item: T,
    docRef: DocumentReference = this.createDoc()
  ): Promise<void> {
    await setDoc(docRef, item);
  }

  async getItems(): Promise<T[]> {
    const itemsCollection = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(itemsCollection);
    const items: T[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as T)
    );
    return items;
  }

  async getItemsByDateRange(from?: Date, to?: Date) {
    const itemRef = collection(this.firestore, this.collectionName);
    const fromDate = from?.getTime() ?? 0;
    const toDate = to?.getTime() ?? 0;
    const q = query(
      itemRef,
      where('createdAt', '>=', fromDate),
      where('createdAt', '<=', toDate)
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as T)
    );
    return items.sort((a, b) => b.createdAt! - a.createdAt!);
  }

  async updateItem(item: T): Promise<void> {
    if (!item.id) {
      throw new Error('Item must have an id to be updated.');
    }
    const itemDocRef = doc(this.firestore, this.collectionName, item.id);
    await setDoc(itemDocRef, item, { merge: true });
  }

  async deleteItem(id: string): Promise<void> {
    const itemDocRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(itemDocRef);
  }
  async getItemById(id: string) {
    if (id == '') return undefined;
    const docRef = doc(this.firestore, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: id, ...docSnap.data() } as T;
    } else {
      return undefined;
    }
  }
}
