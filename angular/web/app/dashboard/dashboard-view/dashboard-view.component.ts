import { Component, OnInit } from '@angular/core';
import { Device, DeviceService } from '../../devices/device';
@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {

  constructor(private deviceService: DeviceService) {}

  devices$ = this.deviceService.devices$;
  ngOnInit() {
  }

}
