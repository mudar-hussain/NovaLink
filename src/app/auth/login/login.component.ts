import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Input() action: string = "Log In";

  constructor(private authService: AuthService) { }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    if (this.action == "Sign Up") {
      const name = form.value.name;
      this.authService.register(email, name, password);
    } else {
      this.authService.login(email, password);
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  toggleAction() {
    if (this.action == "Sign Up") {
      this.action = "Log In";
    } else {
      this.action = "Sign Up";
    }
  }
}
