import { Injectable } from '@angular/core';

import { Category } from "../../models/category.model";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(public firestore: AngularFirestore) { }

  getAllCategories(): AngularFirestoreCollection<Category> {
    return this.firestore.collection('categories');
  }
}
