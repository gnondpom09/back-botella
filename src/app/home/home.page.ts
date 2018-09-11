import { Component, OnInit } from '@angular/core';

import { ActionSheetController } from "@ionic/angular";
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
        private authProvider: AuthService
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
        this.paintingProvider.getPaintingTop().valueChanges().subscribe(paint => {
            paint.forEach(image => {
                console.log(image);
                this.paintingTop = image;
            })
        })
        this.paintingProvider.getPaintingLeft().valueChanges().subscribe(paint => {
            paint.forEach(image => {
                console.log(image);
                this.paintingLeft = image;
            })
        })
        this.paintingProvider.getPaintingRight().valueChanges().subscribe(paint => {
            paint.forEach(image => {
                console.log(image);
                this.paintingRight = image;
            })
        })
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
