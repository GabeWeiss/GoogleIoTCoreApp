import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, concatMap, scan, switchMap } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  links = [
     { path: 'dashboard', text: 'Dashboard', icon: 'settings_input_antenna'},
    { path: 'devices', text: 'Devices', icon: 'settings_input_antenna'}
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

constructor(private breakpointObserver: BreakpointObserver) {}
}
