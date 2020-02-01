import { Slider } from './../../models/slider.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { PaintingService } from "../../services/painting/painting.service";
import * as firebase from 'firebase';
import { AngularFirestore } from "angularfire2/firestore";

@Component({
  selector: 'app-edit-slider',
  templateUrl: './edit-slider.page.html',
  styleUrls: ['./edit-slider.page.scss'],
})
export class EditSliderPage implements OnInit {
  paintingId: string;
  painting: Slider;
  imagePath: string;
  selectedFile: File;

  constructor(private route: ActivatedRoute,
    private paintingService: PaintingService,
    private router: Router,
    private firestore: AngularFirestore,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.paintingId = this.route.snapshot.paramMap.get('id');
    this.paintingService.getPaintingSlider(this.paintingId).valueChanges()
      .subscribe(painting => {
        this.painting = painting;
        this.imagePath = painting.image;
      });
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
    // Upload image and thumbnail in storage and get image path
    this.uploadFile(this.selectedFile)
        .then(() => {
            // Upload thumnail generated
            this.uploadFile(this.selectedFile).then(() => {
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
  * Upload file in storage
  * @param  uid       id of current user
  * @param  imageData source of image to upload
  */
 uploadFile(imageData: File) {
      // references
      const storageRef = firebase.storage().ref();
      const id = this.firestore.createId();
      const imageRef = storageRef.child(`events/${this.paintingId}.jpg`);

  // upload image to storage
  return imageRef.put(imageData)
      .then(() => {
          // get image path 
          imageRef.getDownloadURL().then(rootPath => {
              this.imagePath = rootPath;
          })
      }, er => {
          console.log(er);
      });
  }
  /**
   * Update image in home page
   * @param id id of image in slider
   */
  updatePainting(id) {
    this.paintingService.updateImageSlider(id, this.imagePath);
    this.router.navigateByUrl('/');
  }
}
