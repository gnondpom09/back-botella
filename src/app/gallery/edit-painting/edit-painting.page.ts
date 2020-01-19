import { Painting } from './../../models/painting.model';
import { Category } from './../../models/category.model';
import { CategoryService } from './../../services/category/category.service';
import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth/auth.service";
import { PaintingService } from "../../services/painting/painting.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertController } from "@ionic/angular";

@Component({
  selector: 'app-edit-painting',
  templateUrl: './edit-painting.page.html',
  styleUrls: ['./edit-painting.page.scss'],
})
export class EditPaintingPage implements OnInit {

    isAdmin: boolean;
    newCategory: string;
    categories: Category[];
    radioCategories: any[] = [];
    editPaintingForm;
    paintingId: string;
    painting: Painting;
    title: string;
    technic: string;
    categoryName: string;
    width: number;
    height: number;
    price: number;

  constructor(private authProvider: AuthService,
    private categoryService: CategoryService,
    private userService: UserService,
    private paintingService: PaintingService,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router) {
      // Check if user is authentificate
      this.authProvider.getCurrentUser()
      .subscribe(authState => {
          if (authState) {
              this.userService.getInformations(authState.uid).valueChanges()
                  .subscribe(user => {
                    this.isAdmin = user.role === 'admin' ? true : false;
                  });
              this.categoryService.getAllCategories().valueChanges()
                  .subscribe(categories => {
                      this.categories = categories;
                      this.fillRadioCategories(this.categories);
                  });
          } else {
              // redirect to home page
              this.router.navigateByUrl('');
          }
      });
    }

  ngOnInit() {
        // Get id of painting to update
        this.paintingId = this.route.snapshot.paramMap.get('id');
        // Get informations of painting to update
        this.paintingService.getPainting(this.paintingId).valueChanges()
        .subscribe(painting => {
          this.painting = painting;
          console.log(this.painting);
          this.title = painting.title;
          this.technic = painting.technic;
          this.width = painting.width;
          this.height = painting.height;
          this.price = painting.price > 0 ? painting.price : 0;
          this.categoryService.getDetailOfCategory(painting.category).valueChanges()
            .subscribe(category => {
              this.categoryName = category.name;
            });
      });
  }
  /**
   * Fill radio buttons with values of categories
   * @param categories categories
   */
  private fillRadioCategories(categories: Category[]) {
      categories.forEach(category => {
          this.radioCategories.push({
              type: 'radio',
              label: category.name,
              value: category.id
          })
      });
  }
  /**
   * select technic of the painting
   */
  async openTechnic() {
      // Create alert to display list of technics
      const alert = await this.alertCtrl.create({
          inputs: [
              { type: 'radio', label: 'Pastel', value: 'pastel' },
              { type: 'radio', label: 'Huile', value: 'huile' },
              { type: 'radio', label: 'Fusain', value: 'fusain' },
              { type: 'radio', label: 'Sanguine', value: 'sanguine' },
              { type: 'radio', label: 'Graphite', value: 'graphite' }
          ],
          buttons: [
              {
                  text: 'OK',
                  handler: data => {
                      this.technic = data;
                  }
              },
              {
                  text: 'Annuler'
              }
          ]
      })
      // display alert
      return await alert.present();
    }
    /**
     * Select category of painting
     */
    async openCategory() {
        // create alert to display list of categories
        const alert = await this.alertCtrl.create({
            inputs: this.radioCategories,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.painting.category = data;
                        this.categoryService.getDetailOfCategory(this.painting.category).valueChanges()
                        .subscribe(category => {
                          this.categoryName = category.name;
                        });
                    }
                },
                {
                    text: 'Annuler'
                }
            ]
        })
        // Display alert
        return await alert.present();
    }
    /**
     * Select width of painting
     */
    async openWidth() {
        const numbers = [];
        // set value of modal to select width
        for (let index = 20; index < 220; index++) {
            numbers.push({
                type: 'radio',
                label: index + ' cm',
                value: index
            });
        }
        // create alert to select width
        const alert = await this.alertCtrl.create({
            inputs: numbers,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.width = data;
                    }
                },
                {
                    text: 'Annuler'
                }
            ]
        })
        // display modal
        return alert.present();
    }
    /**
     * Select height of painting
     */
    async openHeight() {
        const numbers = [];
        // set value of modal to select height
        for (let index = 20; index < 220; index++) {
            numbers.push({
                type: 'radio',
                label: index + ' cm',
                value: index
            });
        }
        // Create alert to select height
        const alert = await this.alertCtrl.create({
            inputs: numbers,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.height = data;
                    }
                },
                {
                    text: 'Annuler'
                }
            ]
        });
        // Display alert
        return alert.present();
    }
    /**
     * create new painting
     */
    updatePainting(id: string) {
        const title = this.title;
        const technic = this.painting.technic;
        const category = this.painting.category;
        const width = this.painting.width;
        const height = this.painting.height;
        const price = this.price;
        // update
        this.paintingService.updatePainting(id, title, technic, category, width, height, price);

        this.router.navigateByUrl('/gallery');
    }

}
