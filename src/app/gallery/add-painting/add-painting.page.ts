import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ActionSheetController } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";
import { PaintingService } from "../../services/painting/painting.service";
import { AuthService } from "../../services/auth/auth.service";
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import * as firebase from 'firebase';
import { AngularFirestore, } from "angularfire2/firestore";
//import { ImageResizer } from '@ionic-native/image-resizer/ngx';


@Component({
    selector: 'app-add-painting',
    templateUrl: './add-painting.page.html',
    styleUrls: ['./add-painting.page.scss'],
})
export class AddPaintingPage implements OnInit {
    // Properties
    addPaintingForm;
    imageId: string = '';
    technic: string = '';
    category: string = '';
    width: string = '';
    height: string = '';
    format: string = '';
    imagePath: string = '';
    thumbnail: string = '';

    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController,
        private camera: Camera,
        private paintingProvider: PaintingService,
        private router: Router,
        private firestore: AngularFirestore,
        formBuilder: FormBuilder,
        private authProvider: AuthService,
        //private imageResizer: ImageResizer
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
        // Init form
        this.addPaintingForm = formBuilder.group({
            title: ['', Validators.required],
        })
    }

    ngOnInit() {

    }
    /**
     * select technic of the painting
     */
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
    /**
     * Select category of painting
     */
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
    /**
     * Select width of painting
     */
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
                        this.width = data;
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
    /**
     * Select height of painting
     */
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
                        this.loadImage();
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
     * create new painting
     */
    async addNewPainting() {
        const loader = await this.loadingCtrl.create();
        const id = this.imageId;
        const title = this.addPaintingForm.value.title;
        const technic = this.technic;
        const category = this.category;
        const width = this.width;
        const height = this.height;
        const image = this.imagePath;
        const thumb = this.imagePath;
        console.log('control image path arg : ' + image);

        // Add new painting in database
        if (technic && category && width && height && image !== '') {
            this.paintingProvider.createNewPainting(id, title, technic, category, width, height, image, thumb)
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
                message: 'Tous les champs ne sont pas remplis!'
            })
            alert.then(err => {
                err.present();
            })
        }
        return await loader.present();
    }
    /**
    * Load image from library for add new painting in database
    * @param  selectedSourceType Source type
    */
    async loadImage() {
        // Init loader
        const loader = await this.loadingCtrl.create();

        // Set camera options
        let cameraOptions = this.paintingProvider.getCameraOptions(75, 500, 700);

        // Open library and get image from library
        this.camera.getPicture(cameraOptions).then((imageData) => {
            if (imageData != null) {

                // Create imageId for thumbnail and large image
                this.imageId = this.firestore.createId();

                // generate thumbnail and upload in storage

                // Upload image in storage and get image path
                this.uploadImage(imageData)
                    .then(() => {
                        loader.dismiss();
                    })
                    .catch(er => {
                        console.log(er);
                        loader.dismiss();
                    })
            }
            loader.dismiss();
        })

        return await loader.present()
    }
    optionsThumbnail(imageUri) {
        let options = {
            uri: imageUri,
            quality: 50,
            width: 150,
            height: 150
        }
        return options;
    }
    /**
     * compress image and upload to storage
     * @param image image from library
     */
    createThumbnail(image) {
        // compress image
        this.generateFromImage(image, 150, 150, 0.5, data => {
            console.log('data : ' + data);
            // upload thumbnail in storage and get thumbnail url
            this.uploadThumb(data)
                .then(data => {
                    console.log('upload thumb : ' + data);
                })
        })
    }
    generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
        var canvas: any = document.createElement("canvas");
        var image = new Image();

        image.onload = () => {
            var width = image.width;
            var height = image.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");

            ctx.drawImage(image, 0, 0, width, height);

            // IMPORTANT: 'jpeg' NOT 'jpg'
            var dataUrl = canvas.toDataURL('image/jpeg', quality);

            callback(dataUrl)
        }
        image.src = img;
    }
    /**
    * Upload painting in storage
    * @param  uid       id of current user
    * @param  imageData source of image to upload
    */
    uploadImage(imageData: string) {
        // references
        let storageRef = firebase.storage().ref();
        //this.imageId = this.firestore.createId();
        let imageRef = storageRef.child(`paintings/${this.imageId}/${this.imageId}.jpg`);
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
    * Upload thumb in storage
    * @param  uid       id of current user
    * @param  imageData source of image to upload
    */
    uploadThumb(imageData: string) {
        // references
        let storageRef = firebase.storage().ref();
        //this.imageId = this.firestore.createId();
        let imageRef = storageRef.child(`paintings/${this.imageId}/thumb/${this.imageId}.jpg`);
        let metaData = {
            contentType: 'image/jpeg'
        }

        // upload image to storage
        return imageRef.putString(imageData, 'base64', metaData)
            .then(() => {
                // get image path 
                console.log('url : ' + imageRef);
                imageRef.getDownloadURL().then(rootPath => {
                    console.log('thumbnailPath :  ' + rootPath);
                    this.thumbnail = rootPath;
                })
            }, er => {
                console.log(er);
            })
    }
}
