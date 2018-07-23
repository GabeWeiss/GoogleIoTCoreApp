import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { mergeMap } from 'rxjs/operators';
import { DeviceService, Device } from '../device';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent {
  constructor(private route: ActivatedRoute, private deviceService: DeviceService) { }
  device$ = this.route.params.pipe(this.deviceService.toDevice);
  deviceState$ = this.device$.pipe(this.deviceService.toDeviceState);
  deviceMeasurements$ = this.device$.pipe(this.deviceService.toMeasurements);
  trackMeasurement = (id, rec) => (`${rec.timestamp.seconds}${rec.timestamp.nanoseconds}`);
}
