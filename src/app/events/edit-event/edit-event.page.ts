import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ActionSheetController , AlertController, LoadingController} from "@ionic/angular";

import { EventService } from "../../services/event/event.service";
import { PaintingService } from "../../services/painting/painting.service";
import { Event } from "../../models/event.model";
import { AngularFirestore } from "angularfire2/firestore";
import * as firebase from 'firebase';
import { Ng2ImgMaxService } from "ng2-img-max";
import { Camera } from "@ionic-native/camera/ngx";
import * as moment from 'moment';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

  eventId: string;
  event: Event;
  title: string;
  subTitle: string;
  startDate: Date;
  endDate: Date;
  description: string;
  imagePath: string = '';
  thumbnail: string = '';
  selectedFile: File;
  thumbnailFile: File;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    private ng2ImageMax: Ng2ImgMaxService,
    private camera: Camera,
    private eventService: EventService,
    private paintingService: PaintingService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');

    this.eventService.getEvent(this.eventId).valueChanges()
      .subscribe(event => {
        this.event = event;
        this.title = event.title;
        this.subTitle = event.subTitle;
        this.description = event.content;
        this.thumbnail = event.imagePath;
      })
  }
  test() {
    console.log(this.subTitle);
    
  }
  getStartEvent(event) {
    console.log(event);
  }
  getEndEvent(event) {
    console.log(event);
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
              // Upload thumnail generated
              this.uploadThumbnailFile(this.thumbnailFile, this.eventId).then(() => {
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
      let cameraOptions = this.paintingService.getCameraOptions(75, 500, 700);

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
  async updateEvent() {
      const loader = await this.loadingCtrl.create();
      const id = this.eventId;
      const date = moment().format(); // Publish date
      const image = this.imagePath;
      const thumbnail = this.thumbnail;

      // // Get start date of event detail
      // const startDay = this.startDate.getDay();
      // const startMonth = this.startDate.getMonth();
      // const startYear = this.startDate.getUTCFullYear();

      // // Get end date of event detail
      // const endDay = this.endDate.getDay();
      // const endMonth = this.endDate.getMonth();
      // const endYear = this.endDate.getFullYear();
      
      // // Start and end of event
      // const startOfEvent = new Date(startYear, startMonth, startDay);
      // const endOfEvent = new Date(endYear, endMonth, endDay);
    console.log(this.subTitle);
    
      if (id && this.title && this.subTitle && this.description && this.thumbnail) {
          // create event in database
          this.eventService.updateEvent(id, this.title, this.subTitle, this.description, this.thumbnail)
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
              message: 'Les champs ne doivent pas etre vide!',
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
