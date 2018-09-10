import { Component, OnInit } from '@angular/core';

import { PaintingService } from "../services/painting/painting.service";
import { AuthService } from "../services/auth/auth.service";

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.page.html',
    styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {
    // Properties
    category;
    cat1: string = 'pastel drawing';
    cat2: string = 'escapade';
    cat3: string = 'intimite';
    cat4: string = 'portrait';
    paintings;
    auth: boolean = false;

    constructor(
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
        // select init tab
        this.category = this.cat1;
        // get list of paintings by category
        this.paintings = this.paintingProvider.getAllPaintings().valueChanges();
        
    }

}
