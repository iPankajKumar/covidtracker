import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import * as states from '../../assets/json/IndianStates.json';
import * as cities from '../../assets/json/IndianCities.json';
import { Observable } from 'rxjs';
import { request } from 'http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  indianStates :any=[];
  indianCities: any=[];
  areaCode: any[];
  selectedCodes: string[] = [];
  http: any;
  constructor(el: ElementRef) { 
    this.areaCode = [
      { pinCode: "411043", code: "43" },
      { pinCode: "411044", code: "44" },
      { pinCode: "411045", code: "45" },
      { pinCode: "411046", code: "46" },
      { pinCode: "411047", code: "47" }
    ];
  }
  dateValueSingle: Date;
  dateValueFrom: Date;
  dateValueTo: Date;
  

  ngOnInit() {
     this.indianStates =  states['default'];
  }

  fetchCities(stateCode: string){
   this.indianCities = cities['default'][stateCode];
  }

  fetchPinCodeByCities(){
   
    
  
  }

}