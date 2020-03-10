import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/firestore/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nombre = '';

  constructor(public auth: AuthService) { }

  ngOnInit() {
    
  }

}
