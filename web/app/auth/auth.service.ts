import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AppAuthService {
  constructor(public fireauth:AngularFireAuth){

  }

  state$ = this.fireauth.authState.pipe(
    tap(x => console.log(x))
  )

  login(){
    return this.fireauth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
}
