import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ActionSheetController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { PaintingService } from "../../services/painting/painting.service";
import { UserService } from "../../services/user/user.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import * as firebase from 'firebase';

@Component({
    selector: 'app-add-painting',
    templateUrl: './add-painting.page.html',
    styleUrls: ['./add-painting.page.scss'],
})
export class AddPaintingPage implements OnInit {
    // Properties
    addPaintingForm;
    technic: string = '';
    category: string = '';
    width: string = '';
    height: string = '';
    imagePath: string = '';

    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController,
        private camera: Camera,
        private paintingProvider: PaintingService,
        private userProvider: UserService,
        private router: Router,
        formBuilder: FormBuilder
    ) {
        // Init form
        this.addPaintingForm = formBuilder.group({
            title: ['', Validators.required],
        })
    }

    ngOnInit() {

    }
    async openTechnic() {
        // Create alert to display list of technics
        const alert = await this.alertCtrl.create({
            inputs: [
                { type: 'radio', label: 'Pastel', value: 'pastel' },
                { type: 'radio', label: 'Huile', value: 'huile' },
                { type: 'radio', label: 'Fusain', value: 'fusain' },
                { type: 'radio', label: 'Sanguine', value: 'sanguine' },
                { type: 'radio', label: 'Graphite', value: 'graphite' }
            ],
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        console.log(data);
                        this.technic = data;
                    }
                },
                {
                    text: 'Annuler'
                }
            ]
        })
        // display alert
        return await alert.present();
    }
    async openCategory() {
        // create alert to display list of categories
        const alert = await this.alertCtrl.create({
            inputs: [
                { type: 'radio', label: 'Escapade', value: 'escapade' },
                { type: 'radio', label: 'Pastel drawing', value: 'pastel drawing' },
                { type: 'radio', label: 'Intimité', value: 'intimite' },
                { type: 'radio', label: 'Portrait', value: 'portrait' },
            ],
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        console.log(data);
                        this.category = data;
                    }
                },
                {
                    text: 'Annuler'
                }
            ]
        })
        // Display alert
        return await alert.present();
    }
    async openWidth() {
        const numbers = [];
        // set value of modal to select width
        for (let index = 20; index < 220; index++) {
            numbers.push({
                type: 'radio',
                label: index + ' cm',
                value: index
            });
        }
        // ceate alert to select width
        const alert = await this.alertCtrl.create({
            inputs: numbers,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        console.log(data);
                        this.width = data;
                        console.log(this.width);
                    }
                },
                {
                    text: 'Annuler'
                }
            ]
        })
        // display modal
        return alert.present();
    }
    async openHeight() {
        const numbers = [];
        // set value of modal to select height
        for (let index = 20; index < 220; index++) {
            numbers.push({
                type: 'radio',
                label: index + ' cm',
                value: index
            });
        }
        // Create alert to select height
        const alert = await this.alertCtrl.create({
            inputs: numbers,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        console.log(data);
                        this.height = data;
                        console.log(this.height);

                    }
                },
                {
                    text: 'Annuler'
                }
            ]
        })
        // Display alert
        return alert.present();
    }
    /**
    * Open modal to choose source to load image
    */
    async showActionSheet() {
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                {
                    text: 'Ouvrir la bibliothèque',
                    handler: () => {
                        this.loadImage(this.camera.PictureSourceType.PHOTOLIBRARY);
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
    async addNewPainting() {
        const loader = await this.loadingCtrl.create();
        const title = this.addPaintingForm.value.title;
        const technic = this.technic;
        const category = this.category;
        const width = this.width;
        const height = this.height;
        const image = this.imagePath;
        console.log('control image path arg : ' + image);

        // Add new painting in database
        if (technic && category && width && height && image !== '') {
            this.paintingProvider.addNewPainting(title, technic, category, width, height, image)
            .then(
                () => {
                    // new painting create in database with succcess
                    loader.dismiss().then(() => {
                        // redirect to gallery
                        loader.dismiss();
                        this.router.navigateByUrl('/gallery');
                    })
                }, err => {
                    loader.dismiss();
                    console.log(err);
                }
            )
        } else {
            const alert = this.alertCtrl.create({
                message: 'Tous les champs ne sont pas remplis'
            })
            alert.then(err => {
                err.present();
            })
        }
        return await loader.present();
    }
    /**
    * Load image from camera or photo library
    * @param  selectedSourceType Source type
    */
    async loadImage(selectedSourceType: number) {
        // Init loader
        const loader = await this.loadingCtrl.create();

        // Set image infos form source selected
        let cameraOptions: CameraOptions = {
            sourceType: selectedSourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 75,
            targetWidth: 500,
            targetHeight: 700,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
        }
        // Upload image to user account
        this.camera.getPicture(cameraOptions).then((imageData) => {
            if (imageData != null) {

                // Initialize and get image format
                let base64Picture = "data:image/jpeg;base64," + imageData;

                // Upload image in storage and get image path
                this.uploadImage(imageData)
                    .then(data => {
                        console.log('GET PICTURE');
                        console.log('get image path : ' + this.imagePath); 
                        console.log(data);
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
    * Upload image in staor
    * @param  uid       id of current user
    * @param  imageData source of image to upload
    */
    uploadImage(imageData: string) {
        // references
        let storageRef = firebase.storage().ref();
        let imageName = this.paintingProvider.generateUID();
        let imageRef = storageRef.child(`paintings/${imageName}.jpg`);
        let metaData = {
            contentType: 'image/jpeg'
        }

        // upload image to storage
        return imageRef.putString(imageData, 'base64', metaData)
            .then(url => {
                // get image path 
                console.log('url : ' + imageRef);
                imageRef.getDownloadURL().then(rootPath => {
                    console.log('rootPath :  ' + rootPath);
                    this.imagePath = rootPath;
                })
                console.log('image ref storage : ' + url.ref.fullPath);
                console.log('FILE UPLOADED TO STORAGE !!!!!!!');
                console.log('file : ' + this.imagePath);
            }, er => {
                console.log(er);
            })
    }
}
