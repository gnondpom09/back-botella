import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import * as firebase from 'firebase';
import { IonicStorageModule } from "@ionic/storage";
import { AngularFireAuth } from "angularfire2/auth";
import { Camera } from "@ionic-native/camera/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { ComponentsModule } from "./components/components.module";
import { GalleryPageModule } from "./gallery/gallery.module";
import { ImageResizer } from "@ionic-native/image-resizer/ngx";
import { DetailPage } from "./events/detail/detail.page";
import { Ng2ImgMaxModule } from 'ng2-img-max';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDLiZi-LoXuq3UULNsL1t0cW-vLidwQ0wE",
    authDomain: "artist-41dcb.firebaseapp.com",
    databaseURL: "https://artist-41dcb.firebaseio.com",
    projectId: "artist-41dcb",
    storageBucket: "artist-41dcb.appspot.com",
    messagingSenderId: "272201824228"
};
firebase.initializeApp(config);


@NgModule({
    declarations: [
        AppComponent,
        DetailPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(config),
        IonicStorageModule.forRoot(),
        AngularFirestoreModule,
        AppRoutingModule,
        HttpModule,
        ComponentsModule,
        GalleryPageModule,
        Ng2ImgMaxModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        AngularFireAuth,
        Camera,
        EmailComposer,
        ImageResizer
    ],
    entryComponents: [
        DetailPage
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
