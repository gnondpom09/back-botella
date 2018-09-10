import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { EventService } from '../../services/event/event.service';
import * as moment from 'moment';

@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.page.html',
    styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
    // Properties
    createEventForm: FormGroup;

    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public eventProvider: EventService,
        private router: Router,
        formBuilder: FormBuilder
    ) { 
        this.createEventForm = formBuilder.group({
            title: ['', Validators.required],
            subTitle: ['', Validators.required],
            content: ['', Validators.required]
        })
    }

    ngOnInit() {
    }
    async createEvent() {
        const loader = await this.loadingCtrl.create();
        const title = this.createEventForm.value.title;
        const subTitle = this.createEventForm.value.subTitle;
        const content = this.createEventForm.value.content;

        // create event in database
        this.eventProvider.createEvent(title, subTitle, content, '12/12/12', 'assets/paintings/steph.jpg')
        .then(
            () => {
                loader.dismiss().then(() => {
                    // Redirect to home when event is created
                    this.router.navigateByUrl('/events');
                })
            }, err => {
                loader.dismiss();
                console.log(err);   
            }
        )
        return await loader.present();
    }

}
