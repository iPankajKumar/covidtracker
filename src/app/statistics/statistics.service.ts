import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UrlConst } from "../common/UrlConst";


@Injectable({
    providedIn: 'root'
})
export class StatisticService{

    constructor(private http: HttpClient) {

    };

    statisticsByTimeline() {
        return this.http.get(UrlConst.covidStatistics);

    }

}