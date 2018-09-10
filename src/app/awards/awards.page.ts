import { Component, OnInit } from '@angular/core';
import { AlertController } from "@ionic/angular";
import { AwardService } from "../services/award/award.service";
import { AuthService } from "../services/auth/auth.service";

@Component({
    selector: 'app-awards',
    templateUrl: './awards.page.html',
    styleUrls: ['./awards.page.scss'],
})
export class AwardsPage implements OnInit {
    // Properties
    dates;
    awards;
    auth: boolean = false;

    constructor(
        public alertCtrl: AlertController,
        private awardProvider: AwardService,
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
        // Display all dates
        this.dates = this.awardProvider.getAllDates().valueChanges();
        this.awards = this.awardProvider.getAllAwards().valueChanges();
    }
        /**
     * Delete event
     */
    async deleteAward(id) {
        // create alert to confirm delete event
        const alert = await this.alertCtrl.create({
            message: 'Are you sure you want to delete the event?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Confirm Cancel');
                    },
                },
                {
                    text: 'Okay',
                    handler: () => {
                        // Delete event and return to list of events
                        this.awardProvider.deleteAward(id).then(() => {
                            console.log('award deleted');       
                        });
                    },
                },
            ],
        });
        // Display alert confirmation
        await alert.present();
    }

}
