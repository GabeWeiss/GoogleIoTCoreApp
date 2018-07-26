import { Component, OnInit } from '@angular/core';
import { AppAuthService } from '../auth.service';

@Component({
  selector: 'app-login-widget',
  templateUrl: './login-widget.component.html',
  styleUrls: ['./login-widget.component.css']
})
export class LoginWidgetComponent implements OnInit {

  constructor(private authService:AppAuthService) {

  }

  user$ = this.authService.state$;

  ngOnInit() {
  }

  login(){
    this.authService.login()
  }

}
