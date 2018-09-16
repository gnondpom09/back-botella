import { Component, OnInit } from '@angular/core';

import { PaintingService } from "../services/painting/painting.service";
import { AuthService } from "../services/auth/auth.service";
import { ModalController } from '@ionic/angular';
import { PreviewPage } from "../gallery/preview/preview.page";

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.page.html',
    styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
    // Properties
    category;
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
        private authProvider: AuthService,
        private modalCtrl: ModalController
    ) { 
           // Check if user is authentificate
           this.authProvider.getCurrentUser()
           .subscribe(authState => {
               if (authState) {
                   this.auth = true;
                   console.log(this.auth);
                   console.log('login as : ' + authState.uid);

               } else {
                   this.auth = false;
                   console.log(this.auth);
               }
           })
    }

    ngOnInit() {
        // select init tab
        this.category = this.cat1;
        // get list of paintings by category
        this.paintings = this.paintingProvider.getAllPaintings().valueChanges();
        // fill array of images path for viewer
        this.paintingsList = this.paintingProvider.getAllPaintings().valueChanges();
        this.paintingsList.subscribe(images => {
            this.images = images;
            console.log('images list :  ' + this.images);
            
            images.forEach(image => {
                console.log('image : ' + image.path);
                // fill array of images path
                this.images.push({
                    url: image.path
                });
            });    
        })
        
    }
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
