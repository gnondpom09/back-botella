import { Injectable } from '@angular/core';

import { Event } from "../../models/event.model";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import * as moment from "moment";


@Injectable({
    providedIn: 'root'
})
export class EventService {
    path: string = 'events'

    constructor(
        public firestore: AngularFirestore
    ) { 

    }
    /**
     * Create new event in database
     * @param title title of event
     * @param subTitle date of start and end of event
     * @param content description of event
     * @param date date of publish
     * @param imagePath path of thumb image
     * @param thumbnail thumbnail of image event
     * @param startDate Start date of event
     * @param endDate end date of event
     */
    createEvent(id, title, subTitle, content, date, imagePath, thumbnail, startDate, endDate): Promise<void> {
        return this.firestore.collection(this.path).doc(id).set({
            id,
            title,
            subTitle,
            content,
            date,
            imagePath,
            thumbnail,
            startDate,
            endDate
        })
    }
    /**
     * Get list of all events
     */
    getAllEvents(): AngularFirestoreCollection<Event> {
        return this.firestore.collection(this.path);
    }
    /**
     * get last event
     * @param now date of the day
     */
    getLastEvent(): AngularFirestoreCollection<Event> {
        return this.firestore.collection(this.path, ref => {
            let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query = query.orderBy("startDate", "desc").limit(1);
            return query;
        })
    }
    /**
     * Get detail of event selected
     * @param id id of event
     */
    getEvent(id): AngularFirestoreDocument<Event> {
        return this.firestore.collection(this.path).doc(id);
    }
    /**
     * Update event selected
     * @param id id of event to update
     * @param title title of event
     * @param subTitle date of start and end of event
     * @param content description of event
     * @param imagePath path of thumb
     */
    updateEvent(id, title, subTitle, content, thumbnail, imagePath): Promise<void> {
        return this.firestore.collection(this.path).doc(id).update({
            title: title,
            subTitle: subTitle,
            content: content,
            thumbnail: thumbnail,
            imagePath: imagePath
        });
    }
    /**
     * Delete event
     * @param id id of event
     */
    deleteEvent(id): Promise<void> {
        return this.firestore.collection(this.path).doc(id).delete();
    }
}
