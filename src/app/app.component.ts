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
            this.closeMenu(header, menu, content, slider);

        } else {
            // open menu on click toggle
            this.openMenu(header, menu, content, slider);
        }
    }

    /**
     * Open menu on click toggle and fade in content of the page
     * @param header 
     * @param menu 
     * @param content 
     * @param slider 
     */
    openMenu(header, menu, content, slider) {
        header.classList.add('translate');
        menu.classList.add('on');
        content.classList.add('fade-out');
        if (slider) {
            slider.classList.add('fade-out');
        }
    }

    /**
     * Close menu on click toggle and fade out content of the page
     * @param header 
     * @param menu 
     * @param content 
     * @param slider 
     */
    closeMenu(header, menu, content, slider) {
        header.classList.remove('translate');
        menu.classList.remove('on');
        content.classList.remove('fade-out');
        content.classList.add('fade-in');
        if (slider) {
            slider.classList.remove('fade-out');
            slider.classList.add('fade-in');
        }
    }
}
