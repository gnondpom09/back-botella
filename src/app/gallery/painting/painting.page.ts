import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { PaintingService } from "../../services/painting/painting.service";
import { Painting } from "../../models/painting.model";
import { PreviewPage } from "../preview/preview.page";
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from "../../services/auth/auth.service";
import { UserService } from "../../services/user/user.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-painting',
  templateUrl: './painting.page.html',
  styleUrls: ['./painting.page.scss'],
})
export class PaintingPage implements OnInit {

  id: string;
  painting: Observable<Painting>;
  images;
  auth: boolean;
  isAdmin: boolean;

  @Output() image = new EventEmitter();

  constructor(
    private paintingService: PaintingService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private userService: UserService
    ) { 
      this.id = this.route.snapshot.paramMap.get('id');

      // Check if user is authentificate
      this.authService.getCurrentUser()
        .subscribe(authState => {
          if (authState) {
              this.auth = true;
              // Check role if admin
              this.userService.getInformations(authState.uid).valueChanges()
              .subscribe(user => {
                  this.isAdmin = user.role === 'admin' ? true : false;
              });
          } else {
              this.auth = false;
          }
      })
    }

  ngOnInit() {
    // Get informations of painting
    this.painting = this.paintingService.getPainting(this.id).valueChanges();
  }

  /**
   * Open modal to view large image
   * @param id id of painting
   * @param path path of image
   * @param category category of painting
   */
    async viewLarge(painting: Painting) {

      const modal = await this.modalCtrl.create({
          component: PreviewPage,
          componentProps: {
              id: painting.id,
              url: painting.path,
              images: this.images
          }
      });
      return await modal.present();
    }

    openEditForm(id: string) {
      this.router.navigateByUrl(`/edit-painting/${id}`);
      this.modalCtrl.dismiss();
    }
    /**
     * Delete event
     */
    async deletePainting() {
      // create alert to confirm delete event
      const alert = await this.alertCtrl.create({
          message: 'Are you sure you want to delete painting?',
          buttons: [
              {
                  text: 'Annuler',
                  role: 'cancel',
                  handler: () => {
                      console.log('Confirm Cancel');
                  },
              },
              {
                  text: 'OK',
                  handler: () => {
                      // Delete event and return to list of events
                      this.paintingService.deletePainting(this.id);
                      alert.dismiss();
                      this.modalCtrl.dismiss();
                  },
              },
          ],
      });
      // Display alert confirmation
      await alert.present();
  }

  addToCart() {
    
  }
}
