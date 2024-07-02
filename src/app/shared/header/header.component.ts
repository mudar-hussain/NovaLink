import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { Auth } from 'src/app/models/auth.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  linkedinProfileUrl: string = "#";
  githubProfileUrl: string = "#";
  isWindow: boolean = window.innerWidth > 630 ? true : false;
  menuOpen = false;
  action: string = Auth.signup;
  isDropdownVisible = false;

  constructor(private configService: ConfigService, 
    protected authService: AuthService,
    public auth: AngularFireAuth){}
  
  ngOnInit(): void {
    this.linkedinProfileUrl = this.configService.getLinkedinProfileURL();
    this.githubProfileUrl = this.configService.getGithubProfileUrl();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isWindow = event.target.innerWidth > 630 ? true : false;
  }

  login(): void {
    this.action = Auth.login;
  }
  signup(): void {
    this.action = Auth.signup;
  }
  logout(): void {
    this.action = Auth.login;
    this.authService.logout();
  }
  
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.isDropdownVisible = false;
  }
}