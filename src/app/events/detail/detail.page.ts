import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, ModalController } from "@ionic/angular";
import { Event } from "../../models/event.model";
import { EventService } from "../../services/event/event.service";
import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
    // Properties
    event: Observable<Event>;
    eventId: string;
    auth: boolean;
    isAdmin: boolean;

    constructor(
        private eventProvider: EventService,
        private authProvider: AuthService,
        private userService: UserService,
        public alertCtrl: AlertController,
        private navParams: NavParams,
        private modalCtrl: ModalController,
        private router: Router
    ) {
        // get id of event
        this.eventId = this.navParams.get('id');

        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    this.auth = true;
                    this.userService.getInformations(authState.uid).valueChanges()
                        .subscribe(user => {
                            this.isAdmin = user.role === 'admin' ? true : false;
                        });

                } else {
                    this.auth = false;
                }
            });
    }

    ngOnInit() {
        // Display detail of event
        this.event = this.eventProvider.getEvent(this.eventId).valueChanges();
    }

    /**
     * Delete event
     */
    async deleteEvent() {
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
                        this.eventProvider.deleteEvent(this.eventId).then(() => {
                            this.modalCtrl.dismiss();
                        });
                    },
                },
            ],
        });
        // Display alert confirmation
        await alert.present();
    }
    /**
     * Redirect to edit form of event
     * @param id id of event
     */
    updateEvent(id: string) {
        this.router.navigateByUrl(`/edit-event/${id}`);
        this.modalCtrl.dismiss();
    }

}
