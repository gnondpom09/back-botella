import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { EmailComposer } from "@ionic-native/email-composer/ngx";

@Component({
    selector: 'app-contact',
    templateUrl: './contact.page.html',
    styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
    // Properties
    contactForm: FormGroup;

    constructor(
        public alertCtrl: AlertController,
        public lodingCtrl: LoadingController,
        private router: Router,
        formBuilder: FormBuilder,
        private emailComposer: EmailComposer,
        private platform: Platform
    ) {
        // Init contact form
        this.contactForm = formBuilder.group({
            lastName: ['', Validators.required],
            firstName: ['', Validators.required],
            email: ['', Validators.required],
            subject: ['', Validators.required],
            message: ['', Validators.required]
        })
    }

    ngOnInit() {
    }
    sendEmail() {
        // fields of contact form 
        const lastName = this.contactForm.value.lastName;
        const firstName = this.contactForm.value.firstName;
        const sender = this.contactForm.value.email;
        const subject = this.contactForm.value.subject;
        const message = this.contactForm.value.message;
        const admin = 'laurent.botella@vivaldi.net';

        // content of email
        const email = {
            to: admin,
            subject: subject,
            body: 'Message de ' + lastName + ' ' + firstName + ' - ' + sender + ' : ' + message,
            isHtml: true
        }
        // Send email
        if (this.platform.is('ios') || this.platform.is('android')) {
            this.emailComposer.isAvailable()
            .then(() => {
                this.emailComposer.open(email);

                // redirect to homePage
                this.router.navigateByUrl('');

            })
        } else {
            // Open mail client with datas
            const openMail = window.open('mailto:laurent.botella@vivaldi.net?subject=' 
            + subject 
            + '&body=' + 'Message de ' + lastName + ' ' + firstName + ' : ' 
            + message + ' | Répondre à ' + sender, '_self');

            // focus on mail client with datas
            openMail.focus();
            // redirect to home page
            this.router.navigateByUrl('');
        }
    }
}
