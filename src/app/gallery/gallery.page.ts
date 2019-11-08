import { Component, OnInit } from '@angular/core';

import { PaintingService } from "../services/painting/painting.service";
import { CategoryService } from "../services/category/category.service";
import { AuthService } from "../services/auth/auth.service";
import { ModalController } from '@ionic/angular';
import { PreviewPage } from "../gallery/preview/preview.page";
import { Category } from '../models/category.model';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.page.html',
    styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
    // Properties
    category;
    categories;
    cat1: string = 'pastel drawing';
    cat2: string = 'escapade';
    cat3: string = 'intimite';
    cat4: string = 'portrait';
    paintings;
    paintingsList; // array of paintings to pass in params to viewer
    images;
    auth: boolean = false;

    constructor(
        private paintingProvider: PaintingService,
        private categoryService: CategoryService,
        private authProvider: AuthService,
        private modalCtrl: ModalController
    ) { 
           // Check if user is authentificate
           this.authProvider.getCurrentUser()
           .subscribe(authState => {
               if (authState) {
                   this.auth = true;

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

        // fill array of images path for viewer
        // this.paintingsList = this.paintingProvider.getAllPaintings().valueChanges();
        // this.paintingsList.subscribe(images => {
        //     this.images = images;            
        //     images.forEach(image => {
        //         // fill array of images path
        //         this.images.push({
        //             url: image.path
        //         });
        //     });    
        // })
        
    }
    public getPaintings(id: string) {
        this.paintings = this.paintingProvider.getPaintingsByCategory(id).valueChanges();
    }
    public selectCategory(id: string) {
        this.category = id;
        this.getPaintings(this.category);
    }
    /**
     * Open modal to view large image
     * @param id id of painting
     * @param path path of image
     * @param category category of painting
     */
    async viewLarge(id, path, category) {
        console.log('params: ' + this.images);
        
        let modal = await this.modalCtrl.create({
            component: PreviewPage,
            componentProps: {
                id: id,
                url: path,
                images: this.images
            }
        });
        return await modal.present();
    }
}
