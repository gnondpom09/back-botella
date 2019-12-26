import { Injectable } from '@angular/core';

import { Storage } from "@ionic/storage";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import { User } from "../../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        public storage: Storage,
        public firestore: AngularFirestore
    ) { }

    /**
     * Get id of current uer
     */
    getUid() {
        return this.storage.get('uid');
    }
    /**
     * Update biography
     * @param uid id of user
     * @param text biography
     * @param interview interview
     * @param author author of interview
     */
    editBiography(uid, biography, interview, author): Promise<void> {
        return this.firestore.collection('users').doc(uid).update({
            biography: biography,
            interview: interview,
            author: author
        })
    }
    /**
     * Get informations of the artist
     * @param id id of artist
     */
    getInformations(id): AngularFirestoreDocument<User> {
        return this.firestore.collection('users').doc(id);
    }
}
