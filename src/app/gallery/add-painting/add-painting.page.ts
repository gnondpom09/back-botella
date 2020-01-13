import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController, ActionSheetController, RadioGroup } from "@ionic/angular";
import { Camera } from "@ionic-native/camera/ngx";
import { PaintingService } from "../../services/painting/painting.service";
import { CategoryService } from "../../services/category/category.service";
import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import * as firebase from 'firebase';
import { AngularFirestore } from "angularfire2/firestore";
import { Ng2ImgMaxService } from "ng2-img-max";
import { Subscription } from 'rxjs';
import { Category } from '../../models/category.model';

@Component({
    selector: 'app-add-painting',
    templateUrl: './add-painting.page.html',
    styleUrls: ['./add-painting.page.scss'],
})
export class AddPaintingPage implements OnInit, OnDestroy {
    // Properties
    isAdmin: boolean;
    categories: Category[];
    radioCategories: any[] = [];
    addPaintingForm;
    imageId: string = '';
    technic: string = '';
    category: string = '';
    width: string = '';
    height: string = '';
    format: string = '';

    imagePath: string = '';
    thumbnail: string = '';
    selectedFile: File;
    thumbnailFile: File;

    constructor(
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public actionSheetCtrl: ActionSheetController,
        private camera: Camera,
        private paintingProvider: PaintingService,
        private categoryService: CategoryService,
        private router: Router,
        private firestore: AngularFirestore,
        formBuilder: FormBuilder,
        private authProvider: AuthService,
        private userService: UserService,
        private ng2imgMax: Ng2ImgMaxService
    ) {
        // Init form
        this.addPaintingForm = formBuilder.group({
            title: ['', Validators.required],
        })
    }

    ngOnInit() {
        // Check if user is authentificate
        this.authProvider.getCurrentUser()
            .subscribe(authState => {
                if (authState) {
                    this.userService.getInformations(authState.uid).valueChanges()
                        .subscribe(user => {
                            this.isAdmin = user.role === 'admin' ? true : false;
                        })
                    this.categoryService.getAllCategories().valueChanges()
                        .subscribe(categories => {
                            this.categories = categories;
                            this.fillRadioCategories(this.categories);                            
                        })
                } else {
                    // redirect to home page
                    this.router.navigateByUrl('');
                }
            })
    }
    ngOnDestroy() {
    }
    /**
     * Fill radio buttons with values of categories
     * @param categories categories
     */
    fillRadioCategories(categories: Category[]) {
        categories.forEach(category => {
            this.radioCategories.push({
                type: 'radio',
                label: category.name,
                value: category.id
            })
        });
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
            inputs: this.radioCategories,
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
        const thumb = this.thumbnail;

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
        this.imageId = this.firestore.createId();

        // Generate thumbnail
        this.ng2imgMax.resizeImage(this.selectedFile, 300, 300)
            .subscribe(res => {
                this.thumbnailFile = res;
            })

        // Upload image and thumbnail in storage and get image path
        this.uploadFile(this.selectedFile)
            .then(() => {
                console.log('image uploaded');
                // Upload thumnail generated
                this.uploadThumbnailFile(this.thumbnailFile, this.imageId).then(() => {
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

                // Create and upload thumbnail and upload in storage
                this.ng2imgMax.resizeImage(imageData, 300, 300)
                .subscribe(res => {
                    this.thumbnailFile = new File([res], res.name);
                })

                // Upload image and thumbnail in storage and get image path
                this.uploadImage(imageData)
                    .then(() => {
                        this.uploadThumbnailFile(this.thumbnailFile, this.imageId)
                            .then(() => {
                                loader.dismiss();
                            })
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
    /**
    * Upload image in storage
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
                imageRef.getDownloadURL().then(rootPath => {
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
        //this.imageId = this.firestore.createId();
        let imageRef = storageRef.child(`paintings/${this.imageId}/${this.imageId}.jpg`);

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
   uploadThumbnailFile(imageData: File, imageId: string) {
    // references
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(`paintings/${imageId}/thumb/${imageId}.jpg`);

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
}
