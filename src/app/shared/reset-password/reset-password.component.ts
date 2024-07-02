import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  constructor(protected authService: AuthService) {
   }

   ngOnInit(): void {
   }

  resetPassword() {
    this.authService.sendPasswordResetEmail(this.authService.UserData?.email);
  }
}
