import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'gallery', loadChildren: './gallery/gallery.module#GalleryPageModule' },
  { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
  { path: 'awards', loadChildren: './awards/awards.module#AwardsPageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'add-event', loadChildren: './events/add-event/add-event.module#AddEventPageModule' },
  { path: 'detail/:id', loadChildren: './events/detail/detail.module#DetailPageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'add-award', loadChildren: './awards/add-award/add-award.module#AddAwardPageModule' },
  { path: 'add-painting', loadChildren: './gallery/add-painting/add-painting.module#AddPaintingPageModule' },
  { path: 'edit-bio/:id', loadChildren: './about/edit-bio/edit-bio.module#EditBioPageModule' },
  { path: 'preview/:id', loadChildren: './gallery/preview/preview.module#PreviewPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
