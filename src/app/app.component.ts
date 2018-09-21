import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    // Properties
    isActive: boolean = false;

    public appPages = [
        { title: 'Accueil', url: '/home', icon: 'home' },
        { title: 'A propos', url: '/about', icon: 'information-circle' },
        { title: 'Galerie', url: '/gallery', icon: 'images' },
        { title: 'Récompenses', url: '/awards', icon: 'trophy' },
        { title: 'Évènements', url: '/events', icon: 'list' },
        { title: 'Contact', url: '/contact', icon: 'mail' },
        { title: 'Login', url: '/login', icon: 'log-in' }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
        });
    }
    selectItem() {
        if (this.isActive = false) {
            this.isActive = true;
            console.log(this.isActive);
            
        } else {
            this.isActive = false;
            console.log(this.isActive);
            
        }
    }
}
