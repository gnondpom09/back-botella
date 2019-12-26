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
    isOpen: boolean = true;

    public appPages = [
        { title: 'Accueil', url: '/home', icon: 'home' },
        { title: 'A propos', url: '/about', icon: 'information-circle' },
        { title: 'Galerie', url: '/gallery', icon: 'images' },
        { title: 'Récompenses', url: '/awards', icon: 'trophy' },
        { title: 'Évènements', url: '/events', icon: 'list' },
        { title: 'Contact', url: '/contact', icon: 'mail' }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    /**
     * Stilize toolbar for mobile
     */
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
        });
    }
    /**
     * Toggle menu
     */
    toggleMenu(isOpen: boolean) {
        let menu = document.getElementById('menu');
        this.isOpen = !isOpen;
        
        if (this.isOpen) {
            // close menu on click toggle
            menu.classList.remove('on');
        } else {
            // open menu on click toggle
            menu.classList.add('on');
        }
    }
}
