import { Injectable } from '@angular/core';
import { CloudFirestoreService } from './cloud-firestore.service';
import { Note } from '../models/note';
import { CollectionName } from '../models/const';

@Injectable({
  providedIn: 'root',
})
export class NoteService extends CloudFirestoreService<Note> {
  constructor() {
    super(CollectionName.NOTE);
  }
}
