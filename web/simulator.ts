//fake data streaming...
import * as path from 'path';
import { Observable, defer } from 'rxjs';
import { mergeMap, delay, filter } from 'rxjs/operators';
import * as firebase from 'firebase';

import { initializeApp, firestore, credential, auth } from 'firebase-admin';
const cert = credential.cert(path.resolve(process.cwd(), './_keys/admin.json'));
import { environment } from './environments/environment';

initializeApp({ credential: cert, databaseURL: 'https://iot-dry-run-2.firebaseio.com' });
const simDevices = ['nerve_3'];

const devices = defer(() => firestore()
  .collection('devices')
  .limit(10).get())
  .pipe(
    mergeMap(deviceSnapshot => deviceSnapshot.docs),
    //filter(device => simDevices.some(d => device.id === d)),
    delay(250),
    mergeMap(device => mockHeartbeat(device.id, true).pipe(mergeMap(beat => firestore()
    .collection(`devices/${device.id}/measurements`).add(beat))), 3),
  ).subscribe(beat => {
    //console.log('saved', beat.id)
  });

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const mockHeartbeat = (deviceId, applyFilter = false) => new Observable((sink) => {
  const genBpm = prev => getRandomInt(65, 200);

  let bpm = genBpm(65);
  const f = new KalmanFilter(bpm);
  let filteredBpm = f.update(bpm);


  let id;

  function updateValue() {
    bpm = genBpm(bpm);
    filteredBpm = f.update(bpm);
    const {nanoseconds, seconds} = firebase.firestore.Timestamp.now();
    sink.next({deviceId, bpm: applyFilter ? filteredBpm : bpm, timestamp: {seconds, nanoseconds}, temperature: 98.1 });
    id = setTimeout(() => updateValue(), 1000);
  }
  updateValue();
  return () => clearTimeout(id);
});

export class KalmanFilter {
  private k: number;
  constructor(
    public x: number,
    private q: number = 0.2,
    private r: number = 1,
    private p: number = 1) { }

  update(value) {
    this.p = this.p + this.q;
    this.k = this.p / (this.p + this.r);
    this.x = this.x + this.k * (value - this.x);
    this.p = (1 - this.k) * this.p;
    return this.x;
  }
}
