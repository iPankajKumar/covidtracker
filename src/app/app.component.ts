import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covidtracker';
  opened:boolean;
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
