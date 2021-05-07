import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import * as AllIndiaPincodes from '../../assets/json/AllIndiaPincodes.json';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  indianStates: any = [];
  indianCities: any = [];
  areaCode: any[] = [];
  selectedCodes: string[] = [];
  http: any;
  modalRef: BsModalRef;
  config = {
    animated: true
  };
  constructor(private httpClient :HttpClient,private modalService: BsModalService) {
    this.timerCount(5);
  }
  dateValueSingle: Date;
  dateValueFrom: Date;
  dateValueTo: Date;
  trialCounter = 1;
  dateArrray = [];
  vaccinationSlotResponse:any;
  timer = 0;
  sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  vaccinationSlotUrl = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=";
  ageCategory: string;


  isModalShown = true;
  isSearchModalShown = false;
  @ViewChild('autoShownModal', { static: false }) autoShownModal: ModalDirective;
  @ViewChild('searchModal', { static: false }) searchModal: ModalDirective;
  hideModal() {
    this.autoShownModal.hide();
  }
  hideModalSearch(){
    this.searchModal.hide();
  }
  openModalSearch() {
    this.isSearchModalShown = true;
    this.autoShownModal.hide();
  }
  searchSlotModal() {
    this.searchModal.show();
  }
  ngOnInit() {
    //Get unique states
    var indianState = [...new Set(AllIndiaPincodes['default'].map(item => item.STATENAME))];
    //Sort states alphabetically.
    this.indianStates = indianState.sort((a: any, b: any) => a.localeCompare(b));
  }

  fetchCities(stateName: string) {
    this.indianCities = [];
    var allIndiaStates = AllIndiaPincodes['default'];
    //get all cities 
    var queryData = allIndiaStates.filter(item => item.STATENAME === stateName);
    // uniq all cities
    this.indianCities = [...new Set(queryData.map(item => item.DISTRICT))];

  }

  fetchPinCodeByCities(city: any) {
    this.areaCode = [];
    var allIndiaCities = AllIndiaPincodes['default'];
    //Filter Data by city names
    var queryData = allIndiaCities.filter(item => item.DISTRICT === city);
    //Filter uniq values by pincodes
    var allPincodeData = [...new Set(queryData.map(item => item.PINCODE))];
    for (let index = 0; index < allPincodeData.length; index++) {
      let pinObj = { pinCode: allPincodeData[index] };
      this.areaCode.push(pinObj);
    }
  }

  async slotsByPincodeAndDate() {
    
    this.isSearchModalShown = false;
    console.log("Trial counter", this.trialCounter++);
    this.dateArrray=[];
    this.dateArrray.push(this.dateValueSingle);
    for (let pIndex = 0; pIndex < this.selectedCodes.length; pIndex++) {
      for (let dIndex = 0; dIndex < this.dateArrray.length; dIndex++) {
        let url = this.vaccinationSlotUrl +  this.selectedCodes[pIndex]['pinCode'] + "&date=" + moment(this.dateArrray[dIndex]).format("DD-MM-YYYY");
        
        await this.sleepNow(1000);
        this.httpClient.get(url).subscribe((data)=>{
          this.vaccinationSlotResponse =  data ;//JSON.parse(data);
          console.log("data",data);
          if(this.vaccinationSlotResponse && this.vaccinationSlotResponse.length > 0){
            for (let centre in this.vaccinationSlotResponse.centers) {
              for (let session in this.vaccinationSlotResponse.centers[centre].sessions) {
                if (this.vaccinationSlotResponse.centers[centre].sessions[session].min_age_limit > 44 && this.vaccinationSlotResponse.centers[centre].sessions[session].available_capacity > 0) {
                  console.log("For Pincode", this.vaccinationSlotResponse.centers[centre].pincode, 
                  "at centre ", this.vaccinationSlotResponse.centers[centre].name, "the available capacity is ", 
                  this.vaccinationSlotResponse.centers[centre].sessions[session].available_capacity);
                  
                }
              }
            }
          }
        },(error)=>{
          console.log("error",error);
        });
      }
    }
    let myThis = this;
    setInterval(function () {
      myThis.slotsByPincodeAndDate();
    }, 30000);
  }

  display: any;
  timerCount(minute) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }
}