import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AwardService } from '../../services/award/award.service';
import { AuthService } from "../../services/auth/auth.service";


@Component({
    selector: 'app-add-award',
    templateUrl: './add-award.page.html',
    styleUrls: ['./add-award.page.scss'],
})
export class AddAwardPage implements OnInit {
    // Properties
    createDateForm: FormGroup;
    createAwardForm: FormGroup;
    category;
    addDate: string = 'addDate';
    addAward: string = 'addAward';

    constructor(
        private awardProvider: AwardService,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        private router: Router,
        formBuilder: FormBuilder,
        private authProvider: AuthService
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
        // Init tab selected
        this.category = this.addDate;
        // Init date form
        this.createDateForm = formBuilder.group({
            year: ['', Validators.required],
        })
        // Init award form
        this.createAwardForm = formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            year: ['', Validators.required]
        })
    }

    ngOnInit() {
    }
    /**
     * Add a new date
     */
    async createDate() {
        const loader = await this.loadingCtrl.create();
        const year = this.createDateForm.value.year;

        // Add new date in database
        this.awardProvider.createDate(year)
            .then(
                () => {
                    loader.dismiss().then(() => {
                        // redirect to lit when date is create with success
                        this.router.navigateByUrl('/awards');
                    }), err => {
                        loader.dismiss();
                        console.log(err);

                    }
                }
            )
    }
    /**
     * Add a new award
     */
    async createAward() {
        const loader = await this.loadingCtrl.create();
        const name = this.createAwardForm.value.name;
        const description = this.createAwardForm.value.description;
        const year = this.createAwardForm.value.year;

        // create award in database
        this.awardProvider.createAward(name, description, year)
            .then(
                () => {
                    loader.dismiss().then(() => {
                        // Redirect to list when award is created
                        this.router.navigateByUrl('/awards');
                    })
                }, err => {
                    loader.dismiss();
                    console.log(err);
                }
            )
        return await loader.present();
    }

}
