import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Auth } from 'src/app/models/auth.enum';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Input() action: string = Auth.login;

  constructor(private authService: AuthService, private utils: UtilsService) { }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    if (this.action == Auth.signup) {
      const name = form.value.name;
      const password = form.value.password;
      this.authService.registerWithEmailAndPassword(email, name, password);
    } else if (this.action == Auth.login) {
      const password = form.value.password;
      this.authService.loginWithEmailAndPassword(email, password);
    } else if (this.action == Auth.forgotPassword) {
      this.authService.sendPasswordResetEmail(email);
      this.action = Auth.login;
    }

  }

  loginWithGoogle() {
    this.authService.loginWithGoogleAuth();
  }

  toggleAction() {
    if (this.action == Auth.login) {
      this.action = Auth.signup;
    } else {
      this.action = Auth.login;
    }
  }

  forgotPassword() {
    this.action = Auth.forgotPassword;
  }
}
