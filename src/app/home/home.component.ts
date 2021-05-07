import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import * as AllIndiaPincodes from '../../assets/json/AllIndiaPincodes.json';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
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
  constructor(private httpClient :HttpClient,private modalService: BsModalService, private toastr: ToastrService) {
    this.timerCount(5);
  }
  dateValueSingle: Date;
  dateValueFrom: Date;
  dateValueTo: Date;
  trialCounter = 1;
  dateArrray = [];
  vaccinationSlotResponse:any=[];
  timer = 0;
  sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
  vaccinationSlotUrl = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=";
  ageCategory: number =0;


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

  showToasterMessage(title: string, message: string, type: string){
    switch (type) {
      case 'success':
        this.toastr.success(title,message,{
          timeOut: 10000,
          positionClass :'toast-top-center'
        });
        break;

        case 'warning':
          this.toastr.warning(title,message,{
            timeOut: 10000,
            positionClass :'toast-top-center'
          });
          break;

          case 'info':
            this.toastr.info(title,message,{
              timeOut: 10000,
              positionClass :'toast-top-center'
            });
            break;

            case 'error':
            this.toastr.error(title,message,{
              timeOut: 10000,
              positionClass :'toast-top-center'
            });
            break;
    
      default:
        break;
    }
   

  }

   async slotsByPincodeAndDate() {

    
    this.isSearchModalShown = false;
    console.log("Trial counter", this.trialCounter++);
    this.dateArrray=[];
    this.dateArrray.push(this.dateValueSingle);
    this.showToasterMessage('', 'You have done your part, we will take it from here. Sit back and relax while we crunch some numbers and show you all the available slots within your preferences.', 'info');
    for (let pIndex = 0; pIndex < this.selectedCodes.length; pIndex++) {
      for (let dIndex = 0; dIndex < this.dateArrray.length; dIndex++) {
        let url = this.vaccinationSlotUrl +  this.selectedCodes[pIndex]['pinCode'] + "&date=" + moment(this.dateArrray[dIndex]).format("DD-MM-YYYY");
        
        await this.sleepNow(10000);
       let subscription=  this.httpClient.get(url).subscribe((data)=>{
          this.vaccinationSlotResponse =  data ;//JSON.parse(data);
          this.validCenters();
          subscription.unsubscribe();
         
        },(error)=>{
          this.showToasterMessage('', 'We encountered an error, but it is not your fault, please try again later.', 'error');
        });
      }
    }
    let myThis = this;
    setInterval(function () {
      myThis.slotsByPincodeAndDate();
    }, 3000000);
  }

  validCenters(){
    
    if(this.vaccinationSlotResponse && this.vaccinationSlotResponse.centers.length > 0){
      for (let centre in this.vaccinationSlotResponse.centers) {
        this.vaccinationSlotResponse.centers[centre].isValidCentre =false;
        this.vaccinationSlotResponse.centers[centre].availableSlotsCount = 0;
        for (let session in this.vaccinationSlotResponse.centers[centre].sessions) {
         
          if(this.ageCategory==1){
            if (this.vaccinationSlotResponse.centers[centre].sessions[session].min_age_limit > 44 && this.vaccinationSlotResponse.centers[centre].sessions[session].available_capacity > 0) 
          
            {
              this.vaccinationSlotResponse.centers[centre].isValidCentre = true;
              this.vaccinationSlotResponse.centers[centre].availableSlotsCount++;
             
            }
          }else if(this.ageCategory==0){
            if (this.vaccinationSlotResponse.centers[centre].sessions[session].min_age_limit >17 && this.vaccinationSlotResponse.centers[centre].sessions[session].available_capacity > 0) 
          
            {
              this.vaccinationSlotResponse.centers[centre].isValidCentre = true;
              this.vaccinationSlotResponse.centers[centre].availableSlotsCount++;
             
              
            }
          }

         
        }
      }
    }
    console.log("data->>>>>>>>>>> ",this.vaccinationSlotResponse);
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