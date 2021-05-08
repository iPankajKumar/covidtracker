import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SingleTileComponent } from './single-tile/single-tile.component';


const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'singleTile', component:SingleTileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
