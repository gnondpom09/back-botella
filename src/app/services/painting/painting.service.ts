import { Injectable } from '@angular/core';

import { Painting } from "../../models/painting.model";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import * as firebase from 'firebase';
import { Storage } from "@ionic/storage";

@Injectable({
    providedIn: 'root'
})
export class PaintingService {

    constructor(
        public firestore: AngularFirestore,
        public storage: Storage
    ) { }
    getAllPaintings(): AngularFirestoreCollection<Painting> {
        return this.firestore.collection('paintings');
    }
    // test
    getPaintingsByCategory(id): AngularFirestoreCollection<Painting> {
        return this.firestore.collection('paintings', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query = query.where("category", "==", id);
            return query;
        })
    }
    /**
     * create new painting in database
     * @param title title of painting
     * @param technic technic of painting
     * @param category category of painting
     * @param width width
     * @param height heigth
     * @param imagePath path of image in storage
     */
    addNewPainting(title, technic, category, width, height, path) {
        const id = this.firestore.createId();
        // create painting in database
        return this.firestore.collection('paintings').doc(id).set({
            id,
            title,
            technic,
            category,
            width,
            height,
            path
        })
    }
    getPaintingTop() {
        return this.firestore.collection('home', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query = query.where("place", "==", "top");
            return query;
        })
    }
    getImagesHome(): AngularFirestoreCollection<Painting> {
        return this.firestore.collection('home');
    }
    getPainting(id) {
        return this.firestore.collection('paintings').doc(id);
    }
    deletePainting(id) {
        return this.firestore.collection('paintings').doc(id).delete();
    }
    /**
    * Genarate id of image uploaded in the storage
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
    * create reference to upload image in storage
    * @param  uid       id of current user
    * @param  imageData source of image to upload
    */
    createRefStorage() {
        let storageRef = firebase.storage().ref();
        let imageName = this.generateUID();
        let imageRef = storageRef.child(`paintings/${imageName}.jpg`);

        return imageRef;
    }
    /**
      * Upload image in storage and return path of image
      * @param  uid       id of current user
      * @param  imageData source of image to upload
      */
    uploadImage(imageData: string): string {
        // references
        let storageRef = firebase.storage().ref();
        let imageName = this.generateUID();
        let imageRef = storageRef.child(`paintings/${imageName}.jpg`);
        let metaData = {
            contentType: 'image/jpeg'
        }

        // upload image to storage
        imageRef.putString(imageData, 'base64', metaData)
            .then(() => {
                // get image path 
                console.log('url : ' + imageRef);
                imageRef.getDownloadURL().then(rootPath => {
                    console.log('rootPath :  ' + rootPath);
                    return rootPath;
                })
            }, er => {
                console.log(er);
                return '';
            })
            return '';
    }
}
