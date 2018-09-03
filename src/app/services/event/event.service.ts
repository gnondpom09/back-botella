import { Injectable } from '@angular/core';

import { Event } from "../../models/event.model";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";



@Injectable({
    providedIn: 'root'
})
export class EventService {

    constructor(
        public firestore: AngularFirestore
    ) { 

    }
    getAllEvents(): AngularFirestoreCollection<Event> {
        return this.firestore.collection('posts');
    }
    getEvent(id): AngularFirestoreDocument<Event> {
        return this.firestore.collection('posts').doc(id);
    }
    getPostWordpress(page: number = 1) {

    }
}
