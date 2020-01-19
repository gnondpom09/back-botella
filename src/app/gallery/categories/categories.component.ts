import { Category } from './../../models/category.model';
import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from "@ionic/angular";
import { CategoryService } from "../../services/category/category.service";
import { AngularFirestore } from "angularfire2/firestore";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories: Category[];
  newCategory: string;

  constructor(private modalCtrl: ModalController,
    private firestore: AngularFirestore,
    private alertCtrl: AlertController,
    private categoryService: CategoryService) { 

  }

  ngOnInit() {
    this.categoryService.getAllCategories().valueChanges()
      .subscribe(categories => {
        this.categories = categories;
      });
  }
  updateCategoryName(id: string, name: string) {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id === id) {
        this.categories[i].name = name;
      }
    }
    console.log(this.categories);
  }

  /**
   * Add new category
   * @param name name of new category
   */
  addNewCategory(name: string) {
    const id = this.firestore.createId();
    this.categoryService.createCategory(id, name);
  }

  /**
   * Remove category
   * @param id id
   */
  async removeCategory(id: string) {
      // create alert to confirm delete event
      const alert = await this.alertCtrl.create({
        message: 'Are you sure you want to delete category?',
        buttons: [
            {
                text: 'Annuler',
                role: 'cancel',
                handler: () => {
                    console.log('Confirm Cancel');
                },
            },
            {
                text: 'OK',
                handler: () => {
                    // Delete event and return to list of events
                    this.categoryService.deleteCategory(id);
                    alert.dismiss();
                },
            },
        ],
    });
    // Display alert confirmation
    await alert.present();
  }
  save() {
    this.categories.forEach(category => {
      this.categoryService.updateCategory(category.id, category.name);
    });
    this.modalCtrl.dismiss();
  }
}
