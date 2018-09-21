import { Component, OnInit } from '@angular/core';

import { ActionSheetController, LoadingController } from "@ionic/angular";
import { EventService } from "../services/event/event.service";
import { PaintingService } from "../services/painting/painting.service";
import { AuthService } from "../services/auth/auth.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    // Properties
    events;
    paintingTop;
    paintingLeft;
    paintingRight;
    auth: boolean = false;

    constructor(
        public actionSheetCtrl: ActionSheetController,
        private eventProvider: EventService,
        private paintingProvider: PaintingService,
        private authProvider: AuthService,
        private loadingCtrl: LoadingController
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
        // get last event
        this.events = this.eventProvider.getLastEvent().valueChanges();

        // get images of home page
        this.displayImages();

    }
    /**
     * Display images of home page
     */
    displayImages() {
        const loader = this.loadingCtrl.create({
            spinner: 'dots'
        });
        loader.then(load => {
            load.present();
        })

        const request = new Promise(() => {
            this.paintingProvider.getPaintingTop().valueChanges().subscribe(paint => {
                paint.forEach(image => {
                    console.log(image);
                    this.paintingTop = image;
                })
                // hide loader
                loader.then(load => {
                    load.dismiss();
                })
            })
            this.paintingProvider.getPaintingLeft().valueChanges().subscribe(paint => {
                paint.forEach(image => {
                    console.log(image);
                    this.paintingLeft = image;
                })
                // hide loader
                loader.then(load => {
                    load.dismiss();
                })
            })
            this.paintingProvider.getPaintingRight().valueChanges().subscribe(paint => {
                paint.forEach(image => {
                    console.log(image);
                    this.paintingRight = image;
                })
                // hide loader
                loader.then(load => {
                    load.dismiss();
                })
            })
        })
        return request;
    }
    /**
    * Open modal to open library
    */
    async updateImageHome(paintingId) {
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Ouvrir la bibliothèque',
                    handler: () => {
                        this.paintingProvider.loadImage(paintingId);
                    }
                }, {
                    text: 'Annuler',
                    role: 'cancel'
                }
            ]
        });
        // display action sheet
        return await actionSheet.present();
    }
}
