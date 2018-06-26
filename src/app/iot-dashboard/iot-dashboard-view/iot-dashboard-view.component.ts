import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iot-dashboard-view',
  templateUrl: './iot-dashboard-view.component.html',
  styleUrls: ['./iot-dashboard-view.component.css']
})
export class IotDashboardViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('on init');
  }

}
