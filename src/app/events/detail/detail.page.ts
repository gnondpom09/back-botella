import { Component, OnInit } from '@angular/core';
import { AlertController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { Event } from "../../models/event.model";
import { EventService } from "../../services/event/event.service";
import { AuthService } from "../../services/auth/auth.service";
import { Observable } from "rxjs";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
    // Properties
    event: Observable<Event>;
    eventId: string;
    auth: boolean = false;

    constructor(
        private eventProvider: EventService,
        private authProvider: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        public alertCtrl: AlertController
    ) {
        // get id of event
        this.eventId = this.route.snapshot.paramMap.get('id');
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
                            this.router.navigateByUrl('events');
                        });
                    },
                },
            ],
        });
        // Display alert confirmation
        await alert.present();
    }

}
