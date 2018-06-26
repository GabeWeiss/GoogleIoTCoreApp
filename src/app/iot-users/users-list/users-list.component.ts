import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(private userData: UserDataService) {}

  displayedColumns: string[] = ['name'];
  users$ = this.userData.users$;

  ngOnInit() {
  }
}
