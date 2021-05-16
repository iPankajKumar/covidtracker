import { Component, OnInit } from '@angular/core';
import { STATE_CODES, STATE_CODES_ARRAY } from '../common/Constants';
import { StatisticService } from './statistics.service';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})



export class StatisticsComponent implements OnInit {


  statisticData: any = {};

  constructor(private statisticsService: StatisticService) { }

  ngOnInit() {
    this.getCovidStatsByTimeline();
  


  }

  getCovidStatsByTimeline() {

    let subscription = this.statisticsService.statisticsByTimeline().subscribe((data) => {
      this.statisticData = data;

     this.sortStatsByTotalCases();
      subscription.unsubscribe();
    }, (error) => {
      console.log("error", error);


    });


  }

  sortStatsByTotalCases(){
    
    let clonedData =  cloneDeep(this.statisticData);
    delete clonedData["UN"];
    var sortedMap = new Map();
    var sortedKeys = Object.keys(clonedData) 
    .sort(function(a, b) {
      return clonedData[b].dates['2021-05-15'].total.confirmed- clonedData[a].dates['2021-05-15'].total.confirmed;
    })
   
    sortedKeys.forEach(element => {
      sortedMap.set(element,clonedData[element]);
    });

   console.log("Sorted Data", sortedMap);
  }

  

}
