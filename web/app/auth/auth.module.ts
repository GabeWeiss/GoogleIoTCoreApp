import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list'
import { LoginWidgetComponent } from './login-widget/login-widget.component';

@NgModule({
  imports: [
    CommonModule,
    MatListModule
  ],
  declarations: [LoginWidgetComponent],
  exports: [LoginWidgetComponent]
})
export class AuthModule { }
