import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


//declare gives Angular app access to ga function
declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covidtracker';
  opened:boolean;


  constructor(public router: Router){

    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){

        console.log(event.urlAfterRedirects);
        gtag('config', 'G-HKSZ43LHEZ', {'page_path': event.urlAfterRedirects});
      }
    })
  }

  toggleSidebar(){
    this.opened = !this.opened;
  }

  countdownNumberEl = 'countdown-number';
  countdown = 5;

// countdownNumberEl.textContent = countdown;

// setInterval(function() {
//   countdown = --countdown <= 0 ? 5 : countdown;

//   countdownNumberEl.textContent = countdown;
// }, 1000);
}
