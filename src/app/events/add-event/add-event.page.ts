import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { EventService } from '../../services/event/event.service';
import { PaintingService } from "../../services/painting/painting.service";
import { AuthService } from "../../services/auth/auth.service";
import * as moment from 'moment';
import { Camera } from "@ionic-native/camera/ngx";
import { AngularFirestore } from "angularfire2/firestore";
import * as firebase from 'firebase';
import { Ng2ImgMaxService } from "ng2-img-max";

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
    thumbnail: string = '';
    selectedFile: File;
    thumbnailFile: File;
    defaultStartDate: string;
    defaultEndDate: string;

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
        private authProvider: AuthService,
        private ng2ImageMax: Ng2ImgMaxService
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
            content: ['', Validators.required],
            startDate: [this.defaultStartDate],
            endDate: [this.defaultEndDate]
        })
    }

    ngOnInit() {
    }

    getStartDate(ev) {
        // this.createEventForm.patchValue({
        //     startDate: ev.month.value
        // })
        console.log(this.createEventForm.value);
        
    }
    getEndDate(ev) {
        // let date = new Date(ev.target.value).toISOString().substring(0, 10);
        // this.createEventForm.get('endDate').setValue(date, {
        //   onlyself: true
        // })
        // console.log(this.createEventForm.get('endDate').value);
        console.log(this.createEventForm.value);
        
        
    }
    /**
     * Get file from desktop
     * @param event file selected
     */
    onFileChanged(event) {
        this.selectedFile = event.target.files[0];
    }
    /**
     * Load image and thumbnail in storage
     */
    async onUpload() {
        const loader = await this.loadingCtrl.create();

        // Create imageId for thumbnail and large image
        this.eventId = this.firestore.createId();

        // Generate thumbnail
        this.ng2ImageMax.resizeImage(this.selectedFile, 300, 300)
            .subscribe(res => {
                this.thumbnailFile = res;
            })

        // Upload image and thumbnail in storage and get image path
        this.uploadFile(this.selectedFile)
            .then(() => {
                console.log('image uploaded');
                // Upload thumnail generated
                this.uploadThumbnailFile(this.thumbnailFile, this.eventId).then(() => {
                    console.log('thumbnail uploaded');
                    loader.dismiss();
                })
            })
            .catch(er => {
                console.log(er);
                loader.dismiss();
            })
        return loader.present();
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
        const Id = this.firestore.createId();
        // Create event Id
        this.eventId = Id;
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
    /**
    * Upload file in storage
    * @param  uid       id of current user
    * @param  imageData source of image to upload
    */
    uploadFile(imageData: File) {
        // references
        let storageRef = firebase.storage().ref();
        const Id = this.firestore.createId();
        // Create event Id
        this.eventId = Id;
        let imageRef = storageRef.child(`events/${this.eventId}/${this.eventId}.jpg`);

        // upload image to storage
        return imageRef.put(imageData)
            .then(() => {
                // get image path 
                imageRef.getDownloadURL().then(rootPath => {
                    this.imagePath = rootPath;
                })
            }, er => {
                console.log(er);
            })
    }
    /**
    * Upload thumb in storage
    * @param  uid       id of current user
    * @param  imageData source of image to upload
    */
   uploadThumbnailFile(imageData: File, eventId: string) {
    // references
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(`events/${eventId}/thumb/${eventId}.jpg`);

    // upload image to storage
    return imageRef.put(imageData)
        .then(() => {
            // get image path 
            imageRef.getDownloadURL().then(rootPath => {
                this.thumbnail = rootPath;
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
        const date = moment().format(); // Publish date
        const image = this.imagePath;
        const thumbnail = this.thumbnail;

        // Get start date of event detail
        const startDay = this.createEventForm.value.startDate.day.text;
        const startMonth = this.createEventForm.value.startDate.month.text;
        const startYear = this.createEventForm.value.startDate.year.text;

        // Get end date of event detail
        const endDay = this.createEventForm.value.endDate.day.text;
        const endMonth = this.createEventForm.value.endDate.month.text;
        const endYear = this.createEventForm.value.endDate.year.text;
        
        // Start and end of event
        const startOfEvent = new Date(startYear, startMonth, startDay);
        const endOfEvent = new Date(endYear, endMonth, endDay);

        if (id && title && subTitle && content ) {
            // create event in database
            this.eventProvider.createEvent(id, title, subTitle, content, date, image, thumbnail, startOfEvent, endOfEvent)
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
                loader.dismiss();
                err.present();
            })
        }

        return await loader.present();
    }

}
