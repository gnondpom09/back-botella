import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActionSheetController, ModalController } from "@ionic/angular";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { PaintingService } from "../services/painting/painting.service";
import { Observable } from 'rxjs';
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { Camera } from "@ionic-native/camera/ngx";
import { Subscription } from 'rxjs';
import { EditBioPage } from './edit-bio/edit-bio.page';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit, OnDestroy {
    // properties
    auth: boolean = false;
    // id of artist
    uid: string = "4YzVcpgUziTOLmbQNhZXwnQKZSF2";
    artist;
    isAdmin: boolean = false;
    subscription: Subscription;

    constructor(
        public actionSheetCtrl: ActionSheetController,
        private modalCtrl: ModalController,
        public authProvider: AuthService,
        private userProvider: UserService,
        private paintingProvider: PaintingService,
        private camera: Camera,
        public router: Router
    ) {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    this.auth = true;
                    this.subscription = this.userProvider.getInformations(authState.uid).valueChanges()
                        .subscribe(user => {
                            this.isAdmin = user.role === 'admin' ? true : false;
                        })

                } else {
                    this.auth = false;
                }
            })
    }

    ngOnInit() {
        // display informations of artist
        this.artist = this.userProvider.getInformations(this.uid).valueChanges();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    /**
    * Open modal to open library
    */
    async updateAvatar() {
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Ouvrir la bibliothèque',
                    handler: () => {
                        // load avatar from library
                        this.paintingProvider.loadAvatar(this.uid);
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
     * Open modal to edit biography
     * @param uid id of artist
     */
    async updateBiography(uid) {
        const modal = await this.modalCtrl.create({
            component: EditBioPage,
            componentProps: {
                id: uid
            }
        })
        return await modal.present();
    }
}
