import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IotDashboardViewComponent } from './iot-dashboard-view/iot-dashboard-view.component';

const routes: Routes = [
  { path: '', component: IotDashboardViewComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [],
  declarations: [IotDashboardViewComponent]
})
export class IotDashboardModule { }
