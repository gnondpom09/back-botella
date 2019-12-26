import { Component, OnInit, OnDestroy } from '@angular/core';

import { LoadingController, AlertController, ActionSheetController, ModalController, NavParams } from "@ionic/angular";
import { UserService } from "../../services/user/user.service";
import { AuthService } from "../../services/auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-bio',
    templateUrl: './edit-bio.page.html',
    styleUrls: ['./edit-bio.page.scss'],
})
export class EditBioPage implements OnInit, OnDestroy {
    // Properties
    interview;
    author: string = '';
    biography: string = '';
    artistId: string;
    artist: Observable<any>;
    avatar: string = '';
    isAdmin: boolean = false;
    subscriptionGetRole: Subscription;

    constructor(
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private UserProvider: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private authProvider: AuthService,
        private modalCtrl: ModalController,
        private navParams: NavParams
    ) {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    this.subscriptionGetRole = this.UserProvider.getInformations(authState.uid).valueChanges()
                        .subscribe(user => {
                            this.isAdmin = user.role === 'admin' ? true : false;
                        })

                }
            })

        // get id of artist
        this.artistId = this.navParams.get('id');
    }

    ngOnInit() {
        // get artist
        this.artist = this.UserProvider.getInformations(this.artistId).valueChanges();
        // get informations of artist to update
        this.artist.subscribe(user => {
            console.log(user);
            this.interview = user.interview;
            this.author = user.author;
            this.biography = user.biography;
        })

    }
    ngOnDestroy() {
        this.subscriptionGetRole.unsubscribe();
    }
    /**
     * Update Biography
     */
    async updateBio() {
        const loader = await this.loadingCtrl.create();

        // Update biography in database
        this.UserProvider.editBiography(this.artistId, this.biography, this.interview, this.author)
            .then(
                () => {
                    loader.dismiss().then(() => {
                        // close modal when biography is updated
                        this.modalCtrl.dismiss();
                    })
                }, err => {
                    loader.dismiss();
                    console.log(err);
                }
            )
        return await loader.present();
    }
}
