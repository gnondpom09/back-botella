import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
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
        public emailComposer: EmailComposer
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
        this.emailComposer.isAvailable()
        .then((available: boolean) => {
            console.log(available);   
            if (available) {
                console.log(email); 
                this.emailComposer.open(email);
            }
        })
        
        // redirect to homePage
        //this.router.navigateByUrl('');
    }
}
