import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private authService: AuthService) {}


  onSubmit(form: NgForm) {
    const name = form.value.name;
    const email = form.value.email;
    const password = form.value.password;
    this.authService.register(email, name, password);
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
