import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';

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

  constructor(private configService: ConfigService, private authService: AuthService){}
  
  ngOnInit(): void {
    const user = sessionStorage.getItem('user');
    if (user) this.userData = JSON.parse(user);

    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.newsletterUrl = this.configService.getNewsletterURL();
    this.linkedinProfileUrl = this.configService.getLinkedinProfileURL();
    this.githubProfileUrl = this.configService.getGithubProfileUrl();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isWindow = event.target.innerWidth > 630 ? true : false;
  }

  login(): void {}
  signup(): void {}
  logout(): void {
    this.userData = null;
    this.authService.logout();
    this.menuOpen = false;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}