import { Component, OnInit } from '@angular/core';

import { LoadingController, AlertController, ActionSheetController } from "@ionic/angular";
import { UserService } from "../../services/user/user.service";
import { AuthService } from "../../services/auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";

@Component({
    selector: 'app-edit-bio',
    templateUrl: './edit-bio.page.html',
    styleUrls: ['./edit-bio.page.scss'],
})
export class EditBioPage implements OnInit {
    // Properties
    interview;
    author: string = '';
    biography: string = '';
    artistId: string;
    artist: Observable<any>;
    avatar: string = '';

    constructor(
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private UserProvider: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private authProvider: AuthService
    ) {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    console.log('login as : ' + authState.uid);

                } else {
                    // redirect to home page
                    this.router.navigateByUrl('');
                }
            })

        // get id of artist
        this.artistId = this.route.snapshot.paramMap.get('id');
        console.log('artist id : ' + this.artistId);
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
    async updateBio() {
        const loader = await this.loadingCtrl.create();
        console.log('submit');

        // create event in database
        this.UserProvider.editBiography(this.artistId, this.biography, this.interview, this.author)
            .then(
                () => {
                    loader.dismiss().then(() => {
                        // Redirect to home when event is created
                        this.router.navigateByUrl('/about');
                    })
                }, err => {
                    loader.dismiss();
                    console.log(err);
                }
            )
        return await loader.present();
    }
}
