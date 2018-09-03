import { Injectable } from '@angular/core';

import { AngularFireAuth} from "angularfire2/auth";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        public afAuth: AngularFireAuth
    ) { }
    
    /**
     * Authentification
     * @param username username
     * @param password password
     */
    signIn(username: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(username, password);
    }
    /**
     * create user
     * @param username username
     * @param password password
     */
    signUp(username: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(username, password);
    }
    /**
     * SignOut
     */
    logout() {
        this.afAuth.auth.signOut();
    }
    /**
     * Get current user authentificate
     */
    getCurrentUser() {
        return this.afAuth.authState;
    }
}
