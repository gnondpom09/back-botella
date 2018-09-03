import { Injectable } from '@angular/core';

import { Storage } from "@ionic/storage";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        public storage: Storage
    ) { }

    /**
     * Get id of current uer
     */
    getUid() {
        return this.storage.get('uid');
    }
}
