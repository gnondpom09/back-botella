import { Component, OnInit } from '@angular/core';

import { Storage } from "@ionic/storage";
import * as firebase from 'firebase';
import { AuthService } from "../services/auth/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    // Properties
    username: string = '';
    password: string = '';
    uid: string = '';
    auth: boolean = false;

    constructor(
        public storage: Storage,
        public authProvider: AuthService
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
    }
    /**
     * Authentification and login
     */
    signIn() {

        this.authProvider.signIn(this.username, this.password)
            .then(authState => {
                this.auth = true;
                console.log('auth : ' + authState);
                // connect to app and redirect to home page
                //this.navCtrl.setRoot(TabsPage);
                //this.router.navigateByUrl('home');

                // update user properties authentication and set uid to storage
                this.uid = firebase.auth().currentUser.uid;

                this.storage.set('uid', this.uid);
                console.log(this.uid);

            })
            .catch((err) => {
                //loader.dismiss();
                console.log(err.message);
            })
    }
    /**
     * Log out and return to login page
     */
    logout() {
        this.authProvider.logout();
        this.auth = false;
    }

}
