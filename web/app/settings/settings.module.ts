import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsViewComponent } from './settings-view/settings-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SettingsViewComponent }
    ])
  ],
  declarations: [SettingsViewComponent]
})
export class SettingsModule { }
