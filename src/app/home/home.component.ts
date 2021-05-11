import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import * as AllIndiaPincodes from '../../assets/json/AllIndiaPincodes.json';
import { HttpClient } from "@angular/common/http";
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { interval } from 'rxjs';
import { HomeService } from './home.service';
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
  isValidCenter: boolean = false;
  constructor(private httpClient: HttpClient, private modalService: BsModalService,
    private toastr: ToastrService, private router: Router, private homeService: HomeService) {

  }

  dateValueSingle: Date;
  dateValueFrom: Date;
  dateValueTo: Date;
  trialCounter = 1;
  dateArrray :any;
  vaccinationSlotCurrentResponse: any = [];
  vaccinationSlotAllResponse: any = [];
  timer = 0;
  ageCategory: number = 0;
  resetCityDropdown: number = -1;
  selectedCentre: any;
  selectedState: any;
  selectedCity: any;
  firstTimeOnHomePage: boolean = true;
  noResultsFound: boolean = false;
  showSpinner: boolean = false;
  countdownConfig: any;
  countdownTimer: number = 300;
  minimumDate: Date;

  @ViewChild('autoShownModal', { static: false }) autoShownModal: ModalDirective;
  @ViewChild('searchModal', { static: false }) searchModal: ModalDirective;
  @ViewChild('openSingleTileModal', { static: false }) openSingleTileModal: ModalDirective;
  @ViewChild('countdown', { static: false }) countdown: CountdownComponent;

  ngOnInit() {
    this.fetchStates();
    this.countdownConfig = { leftTime: this.countdownTimer, format: 'mm:ss', demand: true };
    this.dateValueSingle = new Date(moment().valueOf());
    this.minimumDate = new Date(moment().valueOf());

  }

  clearResponse() {
    this.vaccinationSlotAllResponse = [];
  }
  clearAll() {
    this.vaccinationSlotAllResponse = [];
    this.isValidCenter = this.isCenterValid();
    this.firstTimeOnHomePage = true;
  }
  hideModal() {
    this.autoShownModal.hide();
  }
  hideModalSearch() {
    this.searchModal.hide();
  }
  openModalSearch() {
    this.searchModal.show();
    this.autoShownModal.hide();
  }
  searchSlotModal() {
    this.searchModal.show();
  }
  hideAvailableSessionModal() {
    this.openSingleTileModal.hide();
  }
  navigateToSessions(sessionObject) {
    this.router.navigate(['singleTile'], { state: { sessionData: sessionObject } });
  }
  opensingleTileModal(currentCenter) {
    this.selectedCentre = currentCenter;
    if (this.selectedCentre) {
      this.openSingleTileModal.show();
    }
  }

  fetchStates() {
    //Get unique states
    this.indianCities = [];
    this.indianStates = [];
    var indianState = [...new Set(AllIndiaPincodes['default'].map(item => item.STATENAME))];
    //Sort states alphabetically.
    for (let stateIndex = 0; stateIndex < indianState.length; stateIndex++) {
      let state = {
        name: indianState[stateIndex],
        code: indianState[stateIndex]
      }
      this.indianStates.push(state);
    }
    this.indianStates = this.indianStates.sort((a: any, b: any) => a.code.localeCompare(b.code));
    //console.log("states", this.indianStates);
  }

  fetchCities(stateName: string) {
    this.indianCities = [];
    this.areaCode = [];
    this.selectedCodes = [];
    this.resetCityDropdown = -1;
    var allIndiaStates = AllIndiaPincodes['default'];
    //get all cities 
    var queryData = allIndiaStates.filter(item => item.STATENAME === stateName);
    // uniq all cities
    var allCities = [...new Set(queryData.map(item => item.DISTRICTNAME))].sort((a: any, b: any) => a.localeCompare(b));
    //console.log("allCities", allCities);
    allCities.forEach((element: any) => {
      let city = {
        name: element,
        code: element
      }
      this.indianCities.push(city);
    });
    //console.log("indianCities", this.indianCities);
  }

  fetchPinCodeByCities(city: any) {
    this.areaCode = [];
    this.selectedCodes = [];
    var allIndiaCities = AllIndiaPincodes['default'];
    //Filter Data by city names
    var queryData = allIndiaCities.filter(item => item.DISTRICTNAME === city);
    //Filter uniq values by pincodes
    var allPincodeData = [...new Set(queryData.map(item => item.PINCODE))].sort((a: any, b: any) => a.localeCompare(b));;
    for (let index = 0; index < allPincodeData.length; index++) {
      let pinObj = { pinCode: allPincodeData[index] };
      this.areaCode.push(pinObj);
    }
  }

  showToasterMessage(title: string, message: string, type: string) {
    switch (type) {
      case 'success':
        this.toastr.success(title, message, {
          timeOut: 7000,
          positionClass: 'toast-top-center'
        });
        break;

      case 'warning':
        this.toastr.warning(title, message, {
          timeOut: 7000,
          positionClass: 'toast-top-center'
        });
        break;

      case 'info':
        this.toastr.info(title, message, {
          timeOut: 7000,
          positionClass: 'toast-top-center'
        });
        break;

      case 'error':
        this.toastr.error(title, message, {
          timeOut: 7000,
          positionClass: 'toast-top-center',
        });
        break;

      default:
        break;
    }


  }

  showInfoToaster() {
    if (this.selectedCodes.length > 0) {
      this.showToasterMessage('', 'You have done your part, now we will do ours. Sit back and relax while we crunch some numbers and show you all the available slots within your preferences.', 'info');

    }
  }

  initializeSearch(){
    this.isValidCenter = false;
    this.firstTimeOnHomePage = false;
    this.noResultsFound = false;
    this.vaccinationSlotCurrentResponse = [];
    this.searchModal.hide();
    console.log("Trial counter", this.trialCounter++);
    this.dateArrray = [];
    this.dateArrray.push(this.dateValueSingle);

    if (this.selectedCodes.length > 0) {
      this.showSpinner = true;
    }
  }

  slotsByPincodeAndDate() {

    this.initializeSearch();
    console.log("this.selectedCodes",this.selectedCodes);
    
    this.delayedLoop(this.selectedCodes.length, 0);

    //in 5 min refresh again
    interval((this.countdownTimer + 6) * 1000).subscribe(x => {
      this.initializeSearch();
      this.delayedLoop(this.selectedCodes.length, 0);
    });

  }

  delayedLoop(i:any,pIndex:any) {
    let arrLength =  i;
    let tempIndex = pIndex;
    if(this.selectedCodes && pIndex <  this.selectedCodes.length){
      let myThis = this;
      setTimeout(function() {
        myThis.fetchVaccinationSlots(tempIndex,this.dateArrray);  
        console.log(arrLength,tempIndex);
        if (--arrLength) {
          tempIndex++;
          myThis.delayedLoop(arrLength,tempIndex);
        }   //  decrement i and call myLoop again if i > 0
      }, 1500)
    }
  }

  fetchVaccinationSlots(pinIndex:any, dateIndex:any){
    let subscription = this.homeService.vaccinationSlotByPin(this.selectedCodes[pinIndex]['pinCode'], moment(this.dateArrray[dateIndex]).format("DD-MM-YYYY")).subscribe((data) => {
      this.vaccinationSlotCurrentResponse = data;
      this.validCenters();
      subscription.unsubscribe();
    }, (error) => {
      console.log("error",error);
      this.showToasterMessage('', 'We encountered an error, but hey it is not your fault, please try again later.', 'error');
      return;
    });

  }


  validCenters() {

    if (this.vaccinationSlotCurrentResponse && this.vaccinationSlotCurrentResponse.centers.length > 0) {
      for (let centre in this.vaccinationSlotCurrentResponse.centers) {
        this.vaccinationSlotCurrentResponse.centers[centre].isValidCentre = false;
        this.vaccinationSlotCurrentResponse.centers[centre].availableSlotsCount = 0;
        for (let session in this.vaccinationSlotCurrentResponse.centers[centre].sessions) {

          if (this.ageCategory == 1) {
            if (this.vaccinationSlotCurrentResponse.centers[centre].sessions[session].min_age_limit > 44 && this.vaccinationSlotCurrentResponse.centers[centre].sessions[session].available_capacity > 0) {

              this.vaccinationSlotCurrentResponse.centers[centre].isValidCentre = true;
              this.vaccinationSlotCurrentResponse.centers[centre].availableSlotsCount++;


            }
          } else if (this.ageCategory == 0) {
            if (this.vaccinationSlotCurrentResponse.centers[centre].sessions[session].min_age_limit > 17 && this.vaccinationSlotCurrentResponse.centers[centre].sessions[session].available_capacity > 0) {

              this.vaccinationSlotCurrentResponse.centers[centre].isValidCentre = true; // custom flag to decide if the centre is valid for UI
              this.vaccinationSlotCurrentResponse.centers[centre].availableSlotsCount++; // to show slots count

            }
          }
        }

        //Add current centers to global centers to concat rest response
        if (this.vaccinationSlotAllResponse.length > 0) {
          let centreExists = this.checkIfCentreExists(this.vaccinationSlotCurrentResponse.centers[centre]);

          if (centreExists) {

            this.updateCentre(this.vaccinationSlotCurrentResponse.centers[centre]);

          } else {
            this.vaccinationSlotAllResponse.push(this.vaccinationSlotCurrentResponse.centers[centre]);
          }

        } else {
          this.vaccinationSlotAllResponse.push(this.vaccinationSlotCurrentResponse.centers[centre]);
        }

      }
    }
    this.isValidCenter = this.isCenterValid();
    if (!this.vaccinationSlotAllResponse.length || !this.isValidCenter) {
      this.noResultsFound = true;
      this.showSpinner = false;
      this.countdownConfig = { leftTime: this.countdownTimer, format: 'mm:ss', demand: false };
    } else {
      this.noResultsFound = false;
      this.showSpinner = false;
      this.countdownConfig = { leftTime: this.countdownTimer, format: 'mm:ss', demand: false };

    }
    // console.log("All data->>>>>>>>>>> ", this.vaccinationSlotCurrentResponse);
    // console.log("Valid data->>>>>>>>>>> ", this.vaccinationSlotAllResponse);
    // console.log("Pause");
  }


  checkIfCentreExists(currentVacCentre: any): boolean {
    let found = false;
    this.vaccinationSlotAllResponse.forEach(function (item) {
      if (item.center_id === currentVacCentre.center_id) {
        found = true;
      }
    });
    return found;
  }

  updateCentre(currentVacCentre: any) {

    this.vaccinationSlotAllResponse.forEach(function (item) {
      if (item.center_id === currentVacCentre.center_id) {
        item.availableSlotsCount = currentVacCentre.availableSlotsCount;
        item.isValidCentre = currentVacCentre.isValidCentre;
      }
    });

  }

  /**
   * checkAvailableSlots
   */
  public isCenterValid(): boolean {
    let found = false;
    this.vaccinationSlotAllResponse.forEach(function (item) {
      if (item.isValidCentre) {
        found = true;
        return found;
      }
    });
    return found;
  }





}


