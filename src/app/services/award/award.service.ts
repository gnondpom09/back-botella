import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { Award } from "../../models/award.model";
import { Date } from "../../models/date.model";

@Injectable({
    providedIn: 'root'
})
export class AwardService {

    constructor(
        public firestore: AngularFirestore
    ) { }
    /**
     * create new award
     * @param title title aof award
     * @param year year of the award
     */
    createAward(name, description, year): Promise<void> {
        const id = this.firestore.createId();
        // create award in database
        return this.firestore.collection('awards').doc(id).set({
            id,
            name,
            description,
            year
        })
    }
    /**
     * Add new date in database
     * @param year Year to add awards
     */
    createDate(year) {
        const id = this.firestore.createId();
        // Add date to database
        return this.firestore.collection('dates').doc(id).set({
            id,
            year
        })
    }
    /**
     * Get list of dates
     */
    getAllDates(): AngularFirestoreCollection<Date> {
        return this.firestore.collection('dates', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query = query.orderBy('year', 'desc');
            return query;
        });
    }

    /**
     * Get list of awards
     */
    getAllAwards(): AngularFirestoreCollection<Award> {
        
        return this.firestore.collection('awards');
    }
    /**
     * delete award selected
     * @param id id of award
     */
    deleteAward(id): Promise<void> {
        return this.firestore.collection('awards').doc(id).delete();
    }
    /**
     * delete year selected
     * @param id id of year
     */
    deleteDate(id): Promise<void> {
        return this.firestore.collection('dates').doc(id).delete();
    }
}
