import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ToastrModule } from 'ngx-toastr';
import { Pipe, PipeTransform } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CountdownModule } from 'ngx-countdown';
import {TableModule} from 'primeng/table';
import { SingleTileComponent } from './single-tile/single-tile.component';
import {DropdownModule} from 'primeng/dropdown';

@Pipe({
  name: "sort"
})
export class ArraySortPipe {
  transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ArraySortPipe,
    SingleTileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    CalendarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RadioButtonModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    TableModule,
    DropdownModule,
    CountdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
