import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, NavParams, ModalController } from "@ionic/angular";
import { Event } from "../../models/event.model";
import { EventService } from "../../services/event/event.service";
import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { Subscription } from "rxjs";
import { AddEventPage } from "../add-event/add-event.page";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {
    // Properties
    event: Event;
    eventId: string;
    auth: boolean = false;
    isAdmin: boolean = false;
    subscriptionEvent: Subscription;
    subscriptionGetRole: Subscription;

    constructor(
        private eventProvider: EventService,
        private authProvider: AuthService,
        private userService: UserService,
        public alertCtrl: AlertController,
        private navParams: NavParams,
        private modalCtrl: ModalController
    ) {
        // get id of event
        this.eventId = this.navParams.get('id');
        console.log(this.eventId);

        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    this.auth = true;
                    this.subscriptionGetRole = this.userService.getInformations(authState.uid).valueChanges()
                        .subscribe(user => {
                            this.isAdmin = user.role === 'admin' ? true : false;
                        })

                } else {
                    this.auth = false;
                    console.log(this.auth);
                }
            })
    }

    ngOnInit() {
        // Display detail of event
        this.subscriptionEvent = this.eventProvider.getEvent(this.eventId).valueChanges()
            .subscribe(event => {
                this.event = event;
            })
    }
    ngOnDestroy() {
        this.subscriptionEvent.unsubscribe();
        this.subscriptionGetRole.unsubscribe();
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
    async updateEvent() {
        const modal = await this.modalCtrl.create({
            component: AddEventPage,
            componentProps: {
                id: this.eventId
            }
        })
        return await modal.present();
    }

}
