import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventsPage } from './events.page';
//import { AddEventPage } from "./add-event/add-event.page";
//import { DetailPageModule } from "./detail/detail.module";

const routes: Routes = [
    {
        path: '',
        component: EventsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        //DetailPageModule
    ],
    declarations: [EventsPage],
    entryComponents: []
})
export class EventsPageModule { }
