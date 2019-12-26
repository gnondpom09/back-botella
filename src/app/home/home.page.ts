import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActionSheetController, LoadingController, ModalController } from "@ionic/angular";
import { EventService } from "../services/event/event.service";
import { PaintingService } from "../services/painting/painting.service";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { DetailPage } from '../events/detail/detail.page';
import { Event } from '../models/event.model';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    // Properties
    events;
    paintingTop;
    isAdmin: boolean = false;
    subscription: Subscription;
    subscriptionEvent: Subscription;

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
                this.subscription = this.userService.getInformations(authState.uid).valueChanges()
                    .subscribe(user => {
                        this.isAdmin = user.role === 'admin' ? true : false;
                    })

            }
        })

        // get last event
        const now = Date.now();
        this.events = this.eventProvider.getLastEvent(now).valueChanges();

        // get images of home page
        this.displayImages();

    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
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
    /**
     * Display modal to view detail of event
     * @param event event 
     */
    async viewDetail(event: Event) {
        let modal = await this.modalCtrl.create({
            component: DetailPage,
            componentProps: {
                id: event.id
            }
        })
        return await modal.present();
    }
}
