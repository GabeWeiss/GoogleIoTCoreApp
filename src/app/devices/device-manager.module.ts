import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';


const deviceManagerRoutes: Routes = [
  { path: '', component: DeviceListComponent, pathMatch: 'full' }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(deviceManagerRoutes)
  ],
  declarations: [DeviceListComponent, DeviceDetailComponent]
})
export class DeviceManagerModule { }
