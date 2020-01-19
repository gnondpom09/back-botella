import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventService } from "../services/event/event.service";
import { AuthService } from "../services/auth/auth.service";
import { UserService } from "../services/user/user.service";
import { Subscription } from 'rxjs';
import { ModalController } from "@ionic/angular";
import { DetailPage } from "./detail/detail.page";
import { Event } from "../models/event.model";

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {
    // Properties
    events;
    auth: boolean;
    isAdmin: boolean;

    constructor(
        private eventProvider: EventService,
        private authProvider: AuthService,
        private modalCtrl: ModalController,
        private userService: UserService
    ) {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    this.auth = true;
                    this.userService.getInformations(authState.uid).valueChanges()
                        .subscribe(user => {
                            this.isAdmin = user.role === 'admin' ? true : false;
                        })

                } else {
                    this.auth = false;
                }
            })
    }

    ngOnInit() {
        this.eventProvider.getAllEvents().valueChanges()
            .subscribe(events => {
                this.events = events;
            });
    }
    ngOnDestroy() {
    }

    /**
     * Display modal to view detail of event
     * @param event event 
     */
    async viewDetail(event: Event) {
        const modal = await this.modalCtrl.create({
            component: DetailPage,
            componentProps: {
                id: event.id
            }
        })
        return await modal.present();
    }
    
}
