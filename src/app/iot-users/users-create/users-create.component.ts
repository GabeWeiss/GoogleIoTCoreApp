import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.css']
})
export class UsersCreateComponent implements OnInit {

  newUserForm = new FormGroup({
    name: new FormControl()
  });

  constructor(private userData: UserDataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  saveNewUser() {
    this.userData.create(this.newUserForm.value)
      .then(() => {
        return this.router.navigate(['..', 'list'], {relativeTo: this.route });
      })
      .catch(err => {
        console.error('something went terribly wrong', err);
      });
  }

}
