import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'gallery', loadChildren: './gallery/gallery.module#GalleryPageModule' },
  { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
  { path: 'awards', loadChildren: './awards/awards.module#AwardsPageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
