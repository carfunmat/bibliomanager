import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private router:Router) { }

  user = this.auth.authState.pipe(map(authState => {
    console.log('authState: ', authState);
    if (authState) {
      return authState;  
    } else {
      return null;
    }
    
  }))

  login() {
    console.log('google login');
    this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    .then(user => {
      console.log('user logado con google: ', user);
      this.router.navigate(['home']);
    })
    .catch(error => {
      console.log('error en google login: ', error);
    });
  }

  logout() {
    console.log('logout');
    this.auth.auth.signOut();
  }
}
