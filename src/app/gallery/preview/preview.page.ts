import { Component, OnInit } from '@angular/core';

import { AlertController, LoadingController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { PaintingService } from "../../services/painting/painting.service";
import { AuthService } from "../../services/auth/auth.service";
import { Painting } from "../../models/painting.model";
import { Observable } from "rxjs";

@Component({
    selector: 'app-preview',
    templateUrl: './preview.page.html',
    styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {
    //Properties
    paintingId;
    paintingImg;
    paintingTitle: string = '';
    paintingTechnic: string = '';
    paintingCategory: string = '';
    paintingWidth: string = '';
    paintingHeight: string = '';
    painting: Observable<any>;
    auth: boolean = false;

    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        private PaintingProvider: PaintingService,
        private authProvider: AuthService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        // get painting id 
        this.paintingId = this.route.snapshot.paramMap.get('id');
        console.log(this.paintingId);
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
        // get painting detail
        this.painting = this.PaintingProvider.getPainting(this.paintingId).valueChanges();
        this.painting.subscribe(painting => {
            this.paintingTitle = painting.title;
            this.paintingImg = painting.path;
            this.paintingCategory = painting.category;
            this.paintingTechnic = painting.technic;
        })
        console.log(this.painting);

    }
    /**
     * Delete event
     */
    async deletePainting() {
        // create alert to confirm delete event
        const alert = await this.alertCtrl.create({
            message: 'Are you sure you want to delete painting?',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    handler: () => {
                        console.log('Confirm Cancel');
                    },
                },
                {
                    text: 'OK',
                    handler: () => {
                        // Delete event and return to list of events
                        this.PaintingProvider.deletePainting(this.paintingId).then(() => {
                            this.router.navigateByUrl('gallery');
                        });
                    },
                },
            ],
        });
        // Display alert confirmation
        await alert.present();
    }

}
