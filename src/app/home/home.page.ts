import { Component , OnInit} from '@angular/core';

import { EventService } from "../services/event/event.service";
import { PaintingService } from "../services/painting/painting.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    // Properties
    events;
    paintingTop;

    constructor(
        private eventProvider: EventService,
        private paintingProvider: PaintingService
    ) {
    }
    ngOnInit() {
        // get last event
        this.events = this.eventProvider.getLastEvent().valueChanges();
        // get images 
        //this.paintings = this.paintingProvider.getPaintingsHome().valueChanges();
        this.paintingProvider.getPaintingTop().valueChanges().subscribe(paint => {
            paint.forEach(image => {
                console.log(image);
                this.paintingTop = image;
            })    
        })
    }

}
