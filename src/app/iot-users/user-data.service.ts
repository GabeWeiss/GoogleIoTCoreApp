import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private firestore: AngularFirestore) {}
  userCollection = this.firestore.collection('users');
  users$ = this.userCollection.valueChanges();

  create(userData) {
    return this.userCollection.add(userData);
  }
}
