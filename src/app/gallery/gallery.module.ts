import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GalleryPage } from './gallery.page';
import { PreviewPage } from "./preview/preview.page";

const routes: Routes = [
    {
        path: '',
        component: GalleryPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        GalleryPage,
        PreviewPage
    ],
    entryComponents: [
        PreviewPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GalleryPageModule { }
