import { Component, OnInit } from '@angular/core';

import { EventService } from "../services/event/event.service";
import { AuthService } from "../services/auth/auth.service";

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
    // Properties
    events;
    auth: boolean = false;

    constructor(
        private eventProvider: EventService,
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
        this.events = this.eventProvider.getAllEvents().valueChanges();

    }

}
