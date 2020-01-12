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
    isOpen = true;

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
     * @param isOpen state of menu
     */
    toggleMenu(isOpen: boolean) {
        const menu = document.getElementById('menu');
        const header = document.getElementById('header');
        const content = document.getElementById('content');
        const slider = document.getElementById('slider');
        this.isOpen = !isOpen;
        // Check state of toggle menu
        if (this.isOpen) {
            // close menu on click toggle
            header.classList.remove('translate');
            menu.classList.remove('on');
            content.classList.remove('fade-out');
            slider.classList.remove('fade-out');
            content.classList.add('fade-in');
            slider.classList.add('fade-in');
        } else {
            // open menu on click toggle
            header.classList.add('translate');
            menu.classList.add('on');
            content.classList.add('fade-out');
            slider.classList.add('fade-out');
        }
    }
}
