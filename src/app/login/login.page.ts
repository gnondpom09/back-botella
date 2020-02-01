import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import * as firebase from 'firebase';
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { User } from "../models/user.model";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit , OnDestroy{
    // Properties
    username: string = '';
    password: string = '';
    uid: string = '';
    auth: boolean = false;
    currentUser: User;
    subscription: Subscription;

    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public storage: Storage,
        public authProvider: AuthService,
        private userService: UserService,
        private router: Router
    ) {
    }

    ngOnInit() {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
        .subscribe(authState => {
            if (authState) {
                this.auth = true;
                this.subscription = this.userService.getInformations(authState.uid).valueChanges()
                    .subscribe(user => {
                        this.currentUser = user;
                    });
            } else {
                this.auth = false;
            }
        })
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    /**
     * Authentification and login
     */
    async signIn() {
        // init loader
        const loader = await this.loadingCtrl.create();

        this.authProvider.signIn(this.username, this.password)
            .then(authState => {
                loader.dismiss();
                this.auth = true;
                console.log('auth : ' + authState);
                // connect to app and redirect to home page
                this.router.navigateByUrl('');

                // update user properties authentication and set uid to storage
                this.uid = firebase.auth().currentUser.uid;

                this.storage.set('uid', this.uid);
                console.log(this.uid);

            })
            .catch((err) => {
                loader.dismiss();
                // display alert
                const alert = this.alertCtrl.create({
                    message: err
                });
                alert.then(alertError => {
                    alertError.present();
                });
                //loader.dismiss();
                console.log(err.message);
            });
            // display loader
            return await loader.present();
    }
    /**
     * Log out and return to login page
     */
    logout() {
        this.authProvider.logout();
        this.auth = false;
    }
    /**
     * Send link to reset password
     */
    lostPassword() {
        console.log('lien envoyé');
        this.authProvider.resetPassword('laurent.botella@vivaldi.net');
    }

}
