import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, concatMap, scan, switchMap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

export interface ResponseAction {
  type: string;
}

export const enum APIActions {
  Ping = 'ping',
  Pong = 'pong',
  PongFail = 'pong_fail'
}

interface PongAction extends ResponseAction {
  type: APIActions;
}
interface Pong extends PongAction {
  type: APIActions.Pong;
  timestamp: number;
}

interface PongFail extends PongAction {
  type: APIActions.PongFail;
  error: string;
}

function ping(): Promise<PongAction> {
  return fetch('/api/ping')
        .then(res => res.json() as Promise<Pong>)
        .catch(err => ({ type: APIActions.PongFail, error: err.toString() })
      );
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  links = [
    { path: 'iot-dashboard', text: 'Dashboard', icon: 'timelinemo'},
    { path: 'device-manager', text: 'Devices', icon: 'settings_input_antenna'},
    { path: 'iot-users', text: 'Users', icon: 'account_circle'}
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

constructor(private breakpointObserver: BreakpointObserver) {}
}
