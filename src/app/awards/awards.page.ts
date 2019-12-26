import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from "@ionic/angular";
import { AwardService } from "../services/award/award.service";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-awards',
    templateUrl: './awards.page.html',
    styleUrls: ['./awards.page.scss'],
})
export class AwardsPage implements OnInit, OnDestroy {
    // Properties
    dates;
    awards;
    auth: boolean = false;
    isAdmin: boolean = false;
    subscription: Subscription;

    constructor(
        public alertCtrl: AlertController,
        private awardProvider: AwardService,
        private authProvider: AuthService,
        private userService: UserService
    ) {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    this.auth = true;
                    this.subscription = this.userService.getInformations(authState.uid).valueChanges()
                        .subscribe(user => {
                            this.isAdmin = user.role === 'admin' ? true : false;
                        })

                } else {
                    this.auth = false;
                }
            })
    }

    ngOnInit() {
        // Display all awards for each date
        this.dates = this.awardProvider.getAllDates().valueChanges();
        this.awards = this.awardProvider.getAllAwards().valueChanges();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
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
