import {Injectable} from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, withLatestFrom, map, tap } from 'rxjs/operators';

export interface Device {
  deviceId: string;
  firstName: string;
  lastName: string;
  displayName?: string;
}

export interface MeasurementDoc {
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  temperature: number;
  bpm: number;
}

export interface DeviceState {
  state$: Observable<MeasurementDoc>;
}

export const DEVICES_PATH = 'devices';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private af: AngularFirestore) { }
  devices$ = this.af.collection<Device>('devices')
    .valueChanges();

  latestMeasurement = deviceId => this.af
    .collection<MeasurementDoc>(
      `devices/${deviceId}/measurements`,
      ref => ref.orderBy('timestamp', 'desc').limit(1)
    )
    .valueChanges()
    .pipe(
      map(([latestReading]) => latestReading)
    )

  getMeasurements = (deviceId, queryFn?) => this.af.collection(
    `devices/${deviceId}/measurements`,
    queryFn ? queryFn : ref => ref.orderBy('timestamp', 'desc').limit(200)
  ).valueChanges()

  getDeviceDoc = deviceId => this.af
    .doc<Device>(`devices/${deviceId}`)
    .valueChanges()

  getDeviceState = deviceId => this.latestMeasurement(deviceId);

  toDeviceState = (idStream: Observable<{deviceId: string}>) => idStream
    .pipe(switchMap(({deviceId}) => this.getDeviceState(deviceId)))

  toDevice = (idStream: Observable<{id: string}>): Observable<Device> => idStream
    .pipe(switchMap(({id}) => this.getDeviceDoc(id)))

  toMeasurements  = (queryStream: Observable<{deviceId: string}>) => queryStream
    .pipe(switchMap(({deviceId}) => this.getMeasurements(deviceId)))
}
