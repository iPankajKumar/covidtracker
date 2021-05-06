import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import * as allData from '../../assets/json/AllIndiaPincodes.json';

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
  areaCode: any[];
  selectedCodes: string[] = [];
  http: any;
  constructor() { 
  }
  dateValueSingle: Date;
  dateValueFrom: Date;
  dateValueTo: Date;
  

  ngOnInit() {
     //Get unique states
     var indianState = [...new Set(allData['default'].map(item => item.StateName))];
    //Sort states alphabetically.
    this.indianStates = indianState.sort((a:any, b:any) => a.toUpperCase().localeCompare(b.toUpperCase()));
  }

  fetchCities(stateName: string){
   //this.indianCities = cities['default'][stateCode];
   var allDatas  = allData['default'];
   console.log("stateCode",stateName);
   //get all cities 
   var queryData = allDatas.filter( item => item.StateName.toUpperCase() === stateName.toUpperCase());
   // uniq all cities
   this.indianCities = [...new Set(queryData.map(item => item.District))];
   console.log("this.indianCities",this.indianCities);

  }

  fetchPinCodeByCities(city:any){
    var allDatas  = allData['default'];
    //Filter Data by city names
    var queryData = allDatas.filter( item => item.District === city);
    //Filter uniq values by pincodes
    var allPincodeData = [...new Set(queryData.map(item => item.Pincode))];

    for (let index = 0; index < allPincodeData.length; index++) {
      let pinObj = { pinCode: allPincodeData[index]};
      this.areaCode.push(pinObj);
    }
    console.log("fetchPinCodeByCities",city, "queryData",queryData, "this.areaCode",this.areaCode);
  }

}