import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import * as AllIndiaPincodes from '../../assets/json/AllIndiaPincodes.json';

import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  indianStates :any=[];
  indianCities: any=[];
  areaCode: any[]=[];
  selectedCodes: string[] = [];
  http: any;
  constructor() { 
  }
  dateValueSingle: Date;
  dateValueFrom: Date;
  dateValueTo: Date;
  

  ngOnInit() {
     //Get unique states
     var indianState = [...new Set(AllIndiaPincodes['default'].map(item => item.STATENAME))];
    //Sort states alphabetically.
    this.indianStates = indianState.sort((a:any, b:any) => a.localeCompare(b));
  }

  fetchCities(stateName: string){
    this.indianCities = [];
   var allIndiaStates  = AllIndiaPincodes['default'];
   console.log("stateCode",stateName);
   //get all cities 
   var queryData = allIndiaStates.filter( item => item.STATENAME === stateName);
   // uniq all cities
   this.indianCities = [...new Set(queryData.map(item => item.DISTRICT))];
   console.log("this.indianCities",this.indianCities);

  }

  fetchPinCodeByCities(city:any){
    this.areaCode = [];
    var allIndiaCities  = AllIndiaPincodes['default'];
    //Filter Data by city names
    var queryData = allIndiaCities.filter( item => item.DISTRICT === city);
    //Filter uniq values by pincodes
    var allPincodeData = [...new Set(queryData.map(item => item.PINCODE))];

    for (let index = 0; index < allPincodeData.length; index++) {
      let pinObj = { pinCode: allPincodeData[index]};
      this.areaCode.push(pinObj);
    }
    console.log("fetchPinCodeByCities",city, "queryData",queryData, "this.areaCode",this.areaCode);
  }

}