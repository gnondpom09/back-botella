import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { EventService } from '../../services/event/event.service';
import { PaintingService } from "../../services/painting/painting.service";
import { AuthService } from "../../services/auth/auth.service";
import * as moment from 'moment';
import { Camera } from "@ionic-native/camera/ngx";
import { AngularFirestore } from "angularfire2/firestore";
import * as firebase from 'firebase';


@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.page.html',
    styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
    // Properties
    createEventForm: FormGroup;
    eventId: string = '';
    imagePath: string = '';

    constructor(
        public actionSheetCtrl: ActionSheetController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public eventProvider: EventService,
        private paintingProvider: PaintingService,
        private router: Router,
        private camera: Camera,
        private firestore: AngularFirestore,
        formBuilder: FormBuilder,
        private authProvider: AuthService
    ) {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    console.log('login as : ' + authState.uid);

                } else {
                    // redirect to home page
                    this.router.navigateByUrl('');
                }
            })
        // Init event form
        this.createEventForm = formBuilder.group({
            title: ['', Validators.required],
            subTitle: ['', Validators.required],
            content: ['', Validators.required]
        })
    }

    ngOnInit() {
    }
    /**
    * Open modal to choose source to load image
    */
    async showActionSheet() {
        // Create alert
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Ouvrir la bibliothèque',
                    handler: () => {
                        this.loadImageEvent();
                    }
                }, {
                    text: 'Annuler',
                    role: 'cancel'
                }
            ]
        });
        // display action sheet
        return await actionSheet.present();
    }
    /**
    * Load image from photo library for upload painting
    * @param  imageId id of painting
    */
    async loadImageEvent() {
        // Init loader
        const loader = await this.loadingCtrl.create();

        // Set camera options
        let cameraOptions = this.paintingProvider.getCameraOptions(75, 500, 700);

        // Upload image to user account
        this.camera.getPicture(cameraOptions).then((imageData) => {
            if (imageData != null) {

                // Upload image in storage and get image path
                this.uploadImageEvent(imageData)
                    .then(() => {
                        loader.dismiss();
                    })
                    .catch(er => {
                        console.log(er);
                        loader.dismiss();
                    })
            }
            loader.dismiss();
        });
        return await loader.present()
    }
    /**
    * Upload image in storage
    * @param  uid       id of current user
    * @param  imageData source of image to upload
    */
    uploadImageEvent(imageData: string) {
        // references
        let storageRef = firebase.storage().ref();
        const eventId = this.firestore.createId();
        // Create event Id
        this.eventId = eventId;
        let imageRef = storageRef.child(`events/${this.eventId}.jpg`);
        let metaData = {
            contentType: 'image/jpeg'
        }

        // upload image to storage
        return imageRef.putString(imageData, 'base64', metaData)
            .then(() => {
                // get image path 
                console.log('url : ' + imageRef);
                imageRef.getDownloadURL().then(rootPath => {
                    console.log('rootPath :  ' + rootPath);
                    this.imagePath = rootPath;
                })
            }, er => {
                console.log(er);
            })
    }
    async createEvent() {
        const loader = await this.loadingCtrl.create();
        const id = this.eventId;
        const title = this.createEventForm.value.title;
        const subTitle = this.createEventForm.value.subTitle;
        const content = this.createEventForm.value.content;
        const image = this.imagePath;

        if (id && title && subTitle && content && image !== '') {
            // create event in database
            this.eventProvider.createEvent(id, title, subTitle, content, '12/12/12', image)
                .then(
                    () => {
                        loader.dismiss().then(() => {
                            // Redirect to home when event is created
                            this.router.navigateByUrl('/events');
                        })
                    }, err => {
                        loader.dismiss();
                        console.log(err);
                    }
                )
        } else {
            // Display message to alert fields empty
            let alert = this.alertCtrl.create({
                message: 'Tous les champs doivent etre remplis!',
                buttons: ['OK']
            })
            alert.then(err => {
                err.present();
            })
        }

        return await loader.present();
    }

}
