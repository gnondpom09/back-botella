import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { PaintingService } from "../../services/painting/painting.service";
import { Painting } from "../../models/painting.model";

@Component({
  selector: 'app-painting',
  templateUrl: './painting.component.html',
  styleUrls: ['./painting.component.scss']
})
export class PaintingComponent implements OnInit {

  id: string = '';
  subscription: Subscription
  painting: Painting;
  @Output() image = new EventEmitter();

  constructor(
    private paintingService: PaintingService,
    private route: ActivatedRoute
    ) { 
      this.id = this.route.snapshot.paramMap.get('id');
      console.log(this.id);
    }

  ngOnInit() {
    // Get informations of painting
    this.subscription = this.paintingService.getPainting(this.id).valueChanges()
      .subscribe(painting => {
        this.painting = painting;
        console.log(this.painting.title);
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Open modal to view large image
   * @param path path of image
   */
  viewLarge(path: string) {
    this.image.emit(path);
  }

}
