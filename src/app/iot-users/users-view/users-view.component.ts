import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css']
})
export class UsersViewComponent implements OnInit {

  constructor(private firestore: AngularFirestore) {}

  users$ = this.firestore.collection('users').valueChanges();

  ngOnInit() {
  }

}
