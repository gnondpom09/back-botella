import { Component , OnInit} from '@angular/core';

import { EventService } from "../services/event/event.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    // Properties
    events;

    constructor(
        private eventProvider: EventService
    ) {
    }
    ngOnInit() {
        this.events = this.eventProvider.getAllEvents().valueChanges();
    }

}
