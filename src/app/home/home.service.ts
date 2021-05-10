import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay } from "rxjs/operators";
import { UrlConst } from "../common/UrlConst";


@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private http: HttpClient) {

    };

    vaccinationSlotByPin(pinCodeArray: any, dateArray: any) {
        return this.http.get(UrlConst.vaccinationSlotByPin + pinCodeArray + "&date=" + dateArray);

    }

}