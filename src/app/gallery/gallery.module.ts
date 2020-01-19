import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GalleryPage } from './gallery.page';
import { PreviewPage } from "./preview/preview.page";
import { PaintingPage } from "./painting/painting.page";
// import { EditPaintingComponent } from './edit-painting/edit-painting.component';
import { CategoriesComponent } from './categories/categories.component';
// import { AddPaintingPage } from "./add-painting/add-painting.page";

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
        PreviewPage,
        PaintingPage,
        // EditPaintingComponent,
        CategoriesComponent,
        // AddPaintingPage
    ],
    entryComponents: [
        PreviewPage,
        PaintingPage,
        CategoriesComponent
        // AddPaintingPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GalleryPageModule { }
