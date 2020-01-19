import { CategoriesComponent } from './categories/categories.component';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { PaintingService } from "../services/painting/painting.service";
import { CategoryService } from "../services/category/category.service";
import { AuthService } from "../services/auth/auth.service";
import { ModalController } from '@ionic/angular';
import { PreviewPage } from "../gallery/preview/preview.page";
import { Painting } from "../models/painting.model";
import { PaintingPage } from './painting/painting.page';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user/user.service';
import { AddPaintingPage } from './add-painting/add-painting.page';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.page.html',
    styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit, OnDestroy {
    // Properties
    category;
    categories;
    paintings;
    paintingsList; // array of paintings to pass in params to viewer
    images;
    auth: boolean = false;
    isAdmin: boolean = false;

    constructor(
        private paintingProvider: PaintingService,
        private categoryService: CategoryService,
        private authProvider: AuthService,
        private userService: UserService,
        private modalCtrl: ModalController
    ) { 
           // Check if user is authentificate
           this.authProvider.getCurrentUser()
           .subscribe(authState => {
               if (authState) {
                   this.auth = true;
                   // Check role if admin
                   this.userService.getInformations(authState.uid).valueChanges()
                    .subscribe(user => {
                        this.isAdmin = user.role === 'admin' ? true : false
                    })
               } else {
                   this.auth = false;
               }
           })
    }

    ngOnInit() {
        // Get categories
        this.categories = this.categoryService.getAllCategories().valueChanges();
        this.categories.subscribe(categories => {
            // Get first category to display list of paintings
            this.category = categories[0].id;
            // get list of paintings of first category
            this.getPaintings(this.category);
        });
    }

    ngOnDestroy() {
    }

    /**
     * Get list of paintings by category
     * @param id id of category
     */
    public getPaintings(id: string) {
        this.paintingProvider.getPaintingsByCategory(id).valueChanges()
            .subscribe(paintings => {
                this.paintings = paintings;
            })
    }

    /**
     * Update category selected and get paintings
     * @param id Id of category
     */
    public selectCategory(id: string) {
        this.category = id;
        this.getPaintings(this.category);
    }

    /**
     * View informations of painting
     * @param painting Painting selected
     */
    async viewDetail(painting: Painting) {
        const modal = await this.modalCtrl.create({
            component: PaintingPage,
            componentProps: {
                id: painting.id
            }
        })
        return await modal.present();
    }

    /**
     * Open modal to view large image
     * @param id id of painting
     * @param path path of image
     * @param category category of painting
     */
    async viewLarge(id, path, category) {
        const modal = await this.modalCtrl.create({
            component: PreviewPage,
            componentProps: {
                id: id,
                url: path,
                images: this.images
            }
        });
        return await modal.present();
    }

    /**
     * Open Form to ad new painting
     */
    async addPainting() {
        const modal = await this.modalCtrl.create({
            component: AddPaintingPage
        })
        return await modal.present();
    }

    /**
     * Open categories to update
     */
    async openCategories() {
        const Modal = await this.modalCtrl.create({
            component: CategoriesComponent
        })
        return await Modal.present();
    }
}
