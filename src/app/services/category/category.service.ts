import { Injectable } from '@angular/core';

import { Category } from "../../models/category.model";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(public firestore: AngularFirestore) { }

  /**
   * List all categories
   */
  getAllCategories(): AngularFirestoreCollection<Category> {
    return this.firestore.collection('categories');
  }

  getDetailOfCategory(id: string): AngularFirestoreDocument<Category> {
    return this.firestore.collection('categories').doc(id);
  }

  /**
   * Create new vategory
   * @param id id of category
   * @param name name of category
   */
  createCategory(id: string, name: string): Promise<void> {
    return this.firestore.collection('categories').doc(id).set({
      id: id,
      name: name
    });
  }

  /**
   * Modify name of category
   * @param id id of category to update
   * @param name new name of category
   */
  updateCategory(id: string, name: string): Promise<void> {
    return this.firestore.collection('categories').doc(id).update({
      name: name
    });
  }

  /**
   * Delete category
   * @param id id of category to delete
   */
  deleteCategory(id: string): Promise<void> {
    return this.firestore.collection('categories').doc(id).delete();
  }
}
