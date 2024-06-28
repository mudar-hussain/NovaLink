import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-google-signin-btn',
  templateUrl: './google-signin-btn.component.html',
  styleUrls: ['./google-signin-btn.component.css']
})
export class GoogleSigninBtnComponent {

  constructor(private authService: AuthService) {}

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
