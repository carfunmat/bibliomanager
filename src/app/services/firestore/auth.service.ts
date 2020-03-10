import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  email = '';
  pass = '';
  nombre = '';

  constructor(public auth: AngularFireAuth) { }

  user = this.auth.authState.pipe(map(authState => {
    console.log('authState: ', authState);
    if (authState) {
      return authState;  
    } else {
      return null;
    }
    
  }))

  login() {
    console.log('login!');
    this.auth.auth.signInWithEmailAndPassword(this.email, this.pass)
    .then(user => {
      console.log('user logado con email: ', user);
    })
    .catch(error => {
      console.log('error en email login: ', error);
    });
  }

  glogin() {
    console.log('google login!');
    this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    .then(user => {
      console.log('user logado con google: ', user);
    })
    .catch(error => {
      console.log('error en google login: ', error);
    });
  }

  logout() {
    console.log('logout!');
    this.auth.auth.signOut();
  }
}
