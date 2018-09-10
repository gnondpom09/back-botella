import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public appPages = [
        { title: 'Home', url: '/home', icon: 'home' },
        { title: 'About', url: '/about', icon: 'list' },
        { title: 'gallery', url: '/gallery', icon: 'list' },
        { title: 'awards', url: '/awards', icon: 'list' },
        { title: 'events', url: '/events', icon: 'list' },
        { title: 'contact', url: '/contact', icon: 'list' },
        { title: 'login', url: '/login', icon: 'list' }
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
            this.splashScreen.hide();
        });
    }
}
