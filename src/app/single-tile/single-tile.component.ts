import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-tile',
  templateUrl: './single-tile.component.html',
  styleUrls: ['./single-tile.component.css']
})
export class SingleTileComponent implements OnInit {

  selectedCentre:any;
  constructor(private router: Router,public activatedRoute: ActivatedRoute) {
    this.selectedCentre = this.router.getCurrentNavigation().extras.state.sessionData;
    console.log("data",this.selectedCentre);
  }

  ngOnInit() {
   
  }

}
