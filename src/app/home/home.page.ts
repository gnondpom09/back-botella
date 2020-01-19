import { Component, OnInit } from '@angular/core';

import { ActionSheetController, LoadingController, ModalController } from "@ionic/angular";
import { EventService } from "../services/event/event.service";
import { PaintingService } from "../services/painting/painting.service";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { DetailPage } from '../events/detail/detail.page';
import { Event } from '../models/event.model';
// import * as moment from 'moment';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    // Properties
    events;
    event: Event;
    paintingTop;
    isAdmin: boolean;

    constructor(
        public actionSheetCtrl: ActionSheetController,
        private eventProvider: EventService,
        private paintingProvider: PaintingService,
        private authProvider: AuthService,
        private userService: UserService,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController
    ) {
    }
    ngOnInit() {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
        .subscribe(authState => {
            if (authState) {
                this.userService.getInformations(authState.uid).valueChanges()
                    .subscribe(user => {
                        this.isAdmin = user.role === 'admin' ? true : false;
                    });

            }
        });

        // get last event
        this.eventProvider.getLastEvent().valueChanges()
            .subscribe(events => {
                this.events = events;
                // const now = Date.now();
                // const endDate = event.endDate.toDateString();
                // console.log(endDate);
                // if (moment(now).diff(endDate) < 0) {
                //     this.event = event;
                // }
            })

        // get images of home page
        this.displayImages();

    }
    /**
     * Display images of home page
     */
    displayImages() {
        // Display loader
        const loader = this.loadingCtrl.create({
            spinner: 'dots'
        });
        loader.then(load => {
            load.present();
        });

        // Get image to display
        const request = new Promise(() => {
            this.paintingProvider.getPaintingTop().valueChanges().subscribe(paint => {
                paint.forEach(image => {
                    this.paintingTop = image;
                });
                // hide loader
                loader.then(load => {
                    load.dismiss();
                });
            });
        });
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
    /**
     * Display modal to view detail of event
     * @param event event 
     */
    async viewDetail(event: Event) {
        const modal = await this.modalCtrl.create({
            component: DetailPage,
            componentProps: {
                id: event.id
            }
        })
        return await modal.present();
    }
}
