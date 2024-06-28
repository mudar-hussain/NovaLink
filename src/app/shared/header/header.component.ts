import { Component, HostListener, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
// import firebase from 'firebase/compat';
// import firebase from '@angular/FirebaseApp/compat';
import { GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userData: any = '';
  isLoggedIn$: Observable<boolean> | undefined;
  newsletterUrl: string = "#";
  linkedinProfileUrl: string = "#";
  githubProfileUrl: string = "#";
  isWindow: boolean = window.innerWidth > 630 ? true : false;
  menuOpen = false;
  action: string = "Sign Up";

  constructor(private configService: ConfigService, 
    private authService: AuthService,
    public auth: AngularFireAuth,
  private firebase: FirebaseApp){}
  
  ngOnInit(): void {

    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.newsletterUrl = this.configService.getNewsletterURL();
    this.linkedinProfileUrl = this.configService.getLinkedinProfileURL();
    this.githubProfileUrl = this.configService.getGithubProfileUrl();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isWindow = event.target.innerWidth > 630 ? true : false;
  }

  login(): void {
    this.action = "Log In";
    // this.authService.login();
  }
  signup(): void {
    this.action = "Sign Up";
  }
  logout(): void {
    this.action = "Log In";
    this.userData = null;
    this.authService.logout();
    this.menuOpen = false;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}