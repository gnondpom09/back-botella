import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewerComponent } from "../components/viewer/viewer.component";
import { PaintingComponent } from './painting/painting.component';

const routes: Routes = [
  {
    path: '',
    component: ViewerComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewerComponent, PaintingComponent],
  entryComponents: [ViewerComponent]
})
export class ComponentsModule {}
