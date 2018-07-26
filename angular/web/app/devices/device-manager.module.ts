import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceDetailComponent } from './device-detail/device-detail.component';
import { MatCardModule } from '@angular/material/card'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatButtonModule } from '@angular/material/button';

const deviceManagerRoutes: Routes = [
  { path: '', component: DeviceListComponent, pathMatch: 'full' }
];


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    RouterModule.forChild(deviceManagerRoutes)
  ],
  declarations: [DeviceListComponent, DeviceDetailComponent]
})
export class DeviceManagerModule { }
