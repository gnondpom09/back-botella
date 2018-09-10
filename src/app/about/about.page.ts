import { Component, OnInit } from '@angular/core';

import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { Observable } from 'rxjs';
import { User } from "../models/user.model";
import { Router } from "@angular/router";

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    // properties
    auth: boolean = false;
    uid: string = "4YzVcpgUziTOLmbQNhZXwnQKZSF2";
    artist;

    constructor(
        public authProvider: AuthService,
        private userProvider: UserService,
        public router: Router
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
        // display informations of artist
        this.artist = this.userProvider.getInformations(this.uid).valueChanges();
        console.log(this.artist);
        
    }
    updateAvatar() {
        
    }

}
