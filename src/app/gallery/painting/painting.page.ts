import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { PaintingService } from "../../services/painting/painting.service";
import { Painting } from "../../models/painting.model";
import { PreviewPage } from "../preview/preview.page";
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-painting',
  templateUrl: './painting.page.html',
  styleUrls: ['./painting.page.scss'],
})
export class PaintingPage implements OnInit {

  id: string = '';
  subscription: Subscription
  painting: Painting;
  images;
  @Output() image = new EventEmitter();

  constructor(
    private paintingService: PaintingService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
    ) { 
      this.id = this.route.snapshot.paramMap.get('id');  
    }

  ngOnInit() {
    // Get informations of painting
    this.subscription = this.paintingService.getPainting(this.id).valueChanges()
      .subscribe(painting => {
        this.painting = painting;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Open modal to view large image
   * @param id id of painting
   * @param path path of image
   * @param category category of painting
   */
  async viewLarge(id, path, category) {
    console.log('params: ' + this.images);
    
    let modal = await this.modalCtrl.create({
        component: PreviewPage,
        componentProps: {
            id: id,
            url: path,
            images: this.images
        }
    });
    return await modal.present();
  }
}
