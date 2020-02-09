import { Painting } from './../../models/painting.model';
import { Injectable } from '@angular/core';

import { LoadingController, AlertController } from '@ionic/angular';
import { Slider } from '../../models/slider.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
    providedIn: 'root'
})
export class PaintingService {

    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public firestore: AngularFirestore,
        public storage: Storage,
        public camera: Camera
    ) { }
    getAllPaintings(): AngularFirestoreCollection<Painting> {
        return this.firestore.collection('paintings');
    }
    // test
    getPaintingsByCategory(id: string): AngularFirestoreCollection<Painting> {
        return this.firestore.collection('paintings', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query = query.where('category', '==', id);
            return query;
        })
    }
    /**
     * create new painting in database
     * @param title title of painting
     * @param technic technic of painting
     * @param category category of painting
     * @param width width
     * @param height height
     * @param imagePath path of image in storage
     */
    createNewPainting(id: string,
        title: string,
        technic: string,
        category: string,
        width: number,
        height: number,
        path: string,
        thumb: string,
        price: number = 0): Promise<void> {
        // create painting in database
        return this.firestore.collection('paintings').doc(id).set({
            id,
            title,
            technic,
            category,
            width,
            height,
            path,
            thumb,
            price
        });
    }
    /**
     * Update informations of painting
     * @param id id of painting
     * @param title title
     * @param technic technic
     * @param category category
     * @param width width
     * @param height height
     * @param price price
     */
    updatePainting(id: string, title: string, technic: string, category: string, width: number, height: number, price = 0): Promise<void> {
        // Update informations
        return this.firestore.collection('paintings').doc(id).update({
            title,
            technic,
            category,
            width,
            height,
            price
        });
    }
    /**
     * Get painting for top of home page
     */
    getPaintingTop(): AngularFirestoreCollection<Painting> {
        return this.firestore.collection('home', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query = query.where('place', '==', 'top');
            return query;
        });
    }
    getPaintingSlider(id: string): AngularFirestoreDocument<Slider> {
        return this.firestore.collection('home').doc(id);
    }
    /**
     * get painting detail
     * @param id id of painting
     */
    getPainting(id: string): AngularFirestoreDocument<Painting> {
        return this.firestore.collection('paintings').doc(id);
    }
    /**
     * delete painting from database and storage
     * @param imageId id of painting
     */
    deletePainting(imageId: string): Promise<void> {
        // Delete painting in database
        return this.firestore.collection('paintings').doc(imageId).delete();
    }
    /**
    * Generate id of image uploaded in the storage
    * @return UID of image
    */
    generateUID(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    /**
     * set options of image
     * @param quality quality of image
     * @param width width
     * @param height height
     */
    getCameraOptions(quality: number, width: number, height: number) {
        const cameraOptions: CameraOptions = {
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: quality,
            targetWidth: width,
            targetHeight: height,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
        };
        return cameraOptions;
    }
    /**
    * Load image from photo library for update home page
    * @param  imageId id of image
    */
    async loadImage(imageId: string) {
        // Init loader
        const loader = await this.loadingCtrl.create();

        // Set camera options
        const cameraOptions = this.getCameraOptions(75, 500, 700);

        // Upload image to user account
        this.camera.getPicture(cameraOptions).then((imageData) => {
            if (imageData != null) {

                // Upload image in storage and get image path
                this.uploadImage(imageId, imageData)
                    .then(() => {
                        loader.dismiss();
                    })
                    .catch(er => {
                        console.log(er);
                        loader.dismiss();
                    });
            }
            loader.dismiss();
        });
        return await loader.present();
    }
    /**
    * Load image from photo library for upload avatar
    * @param  userId id of
    */
    async loadAvatar(userId: string): Promise<void> {
        // Init loader
        const loader = await this.loadingCtrl.create();

        // Set camera options
        const cameraOptions = this.getCameraOptions(75, 500, 700);

        // Upload image to user account
        this.camera.getPicture(cameraOptions).then((imageData) => {
            if (imageData != null) {

                // Upload image in storage and get image path
                this.uploadAvatar(userId, imageData)
                    .then(() => {
                        loader.dismiss();
                    })
                    .catch(er => {
                        console.log(er);
                        loader.dismiss();
                    });
            }
            loader.dismiss();
        });

        return await loader.present();
    }
    /**
    * Upload image in storage and update in database
    * @param  uid       id of current user
    * @param  imageData source of image to upload
    */
    uploadImage(imageId: string, imageData: string): Promise<void> {
        // references
        const storageRef = firebase.storage().ref();
        const oldRef = storageRef.child(`home/${imageId}.jpg`);
        oldRef.delete();
        // replace image ref in storage
        const imageRef = storageRef.child(`home/${imageId}.jpg`);
        const metaData = {
            contentType: 'image/jpeg'
        };

        // upload image to storage
        return imageRef.putString(imageData, 'base64', metaData)
            .then(() => {
                // get image path
                imageRef.getDownloadURL().then(rootPath => {
                    // update avatar in database
                    this.firestore.collection('home').doc(imageId).update({
                        image: rootPath
                    });
                });
            }, er => {
                console.log(er);
            });
    }
    updateImageSlider(id: string, imagePath: string): Promise<void> {
        return this.firestore.collection('home').doc(id).update({
            image: imagePath
        });
    }
    /**
    * Upload avatar in storage and update in database
    * @param  uid       id of current user
    * @param  imageData source of image to upload
    */
    uploadAvatar(userId: string, imageData: string): Promise<void> {
        // references
        const storageRef = firebase.storage().ref();
        const oldRef = storageRef.child(`avatar/${userId}.jpg`);
        oldRef.delete();
        // replace image ref in storage
        const imageRef = storageRef.child(`avatar/${userId}.jpg`);
        const metaData = {
            contentType: 'image/jpeg'
        };

        // upload image to storage
        return imageRef.putString(imageData, 'base64', metaData)
            .then(() => {
                // get image path
                console.log('url : ' + imageRef);
                imageRef.getDownloadURL().then(rootPath => {
                    console.log('rootPath :  ' + rootPath);
                    // update avatar in database
                    this.firestore.collection('users').doc(userId).update({
                        avatar: rootPath
                    });
                });
            }, er => {
                console.log(er);
            });
    }
}
