import { User } from './../models/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActionSheetController, ModalController } from "@ionic/angular";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { PaintingService } from "../services/painting/painting.service";
import { Router } from "@angular/router";
import { Subscription, Observable } from 'rxjs';
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
    artist: Observable<User>;
    isAdmin: boolean = false;
    subscription: Subscription;

    constructor(
        public actionSheetCtrl: ActionSheetController,
        private modalCtrl: ModalController,
        public authProvider: AuthService,
        private userProvider: UserService,
        private paintingProvider: PaintingService,
        public router: Router
    ) {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    this.auth = true;
                    this.userProvider.getInformations(authState.uid).valueChanges()
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
