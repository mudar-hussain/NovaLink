import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { UtilsService } from './utils.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public UserData: any;
  private userDataSubject = new BehaviorSubject<any>(null);
  private logoutSubject = new Subject<void>();

  constructor(
    private firebaseAuth: Auth,
    private toastr: ToastrService,
    private router: Router,
    private utils: UtilsService
  ) {
    onAuthStateChanged(this.firebaseAuth, (user: any) => {
      if (user) {
        this.UserData = user;
        localStorage.setItem('user', JSON.stringify(this.UserData));
        this.userDataSubject.next(this.UserData);
        // Optionally check token expiration and refresh
        // this.refreshTokenIfNeeded(user);
      } else {
        localStorage.setItem('user', 'null');
        this.userDataSubject.next(null);
        this.router.navigate(['']); // Redirect to home page
        this.logoutSubject.next(); // Emit logout event
      }
      this.utils.closeLoginModal();
    });
  }

  private async refreshTokenIfNeeded(user: User): Promise<void> {
    try {
      const idTokenResult = await user.getIdTokenResult();
      const expirationTime = new Date(idTokenResult.expirationTime).getTime();
      if (expirationTime < Date.now()) {
        await user.getIdToken(true);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }

  sendEmailVerification(): Promise<void> {
    return sendEmailVerification(this.getAuthFireUser() as User);
  }

  getAuthFireUser(): User | null {
    return this.firebaseAuth.currentUser;
  }

  getAuthLocalUser(): any {
    const token = localStorage.getItem('user');
    return token ? JSON.parse(token) : null;
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('user');
    return token !== 'null' && token !== null;
  }
  
  get logout$() {
    return this.logoutSubject.asObservable();
  }

  getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  registerWithEmailAndPassword(email: string, name: string, password: string): void {
    this.utils.openSpinner();
    createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then((response) => {
        this.UserData = response.user;
        this.sendEmailVerification();
        updateProfile(response.user, { displayName: name })
          .then(() => {
            this.UserData.displayName = name;
            // this.setUserData();
            this.toastr.success('Registered Sucessfully');
            this.router.navigate(['/dashboard']);
          })
          .catch((error) => {
            this.toastr.warning(this.utils.getErrorMessage(error.code));
          });
      })
      .catch((error) => {
        this.toastr.warning(this.utils.getErrorMessage(error.code));
      })
      .finally(() => this.utils.closeSpinner());
  }

  loginWithEmailAndPassword(email: string, password: string): void {
    this.utils.openSpinner();
    signInWithEmailAndPassword( this.firebaseAuth, email, password )
      .then((response) => {
        this.UserData = response?.user;
        this.toastr.success('Logged in Sucessfully');
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        this.toastr.warning(this.utils.getErrorMessage(error.code));
      })
      .finally(() => this.utils.closeSpinner());
  }

  loginWithGoogleAuth(): void {
    this.loginWithPopup(new GoogleAuthProvider());
  }

  loginWithPopup(provider: any): void {
    this.utils.openSpinner();
    this.firebaseAuth.useDeviceLanguage();
    signInWithPopup(this.firebaseAuth, provider)
      .then((response) => {
        this.UserData = response.user;
        this.toastr.success('Logged in Sucessfully');
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        this.toastr.warning(this.utils.getErrorMessage(error.code));
      })
      .finally(() => this.utils.closeSpinner());
  }

  logout(): void {
    this.utils.openSpinner();
    signOut(this.firebaseAuth)
      .then(() => {
        // this.removeUserData();
        this.toastr.success('Logged out Sucessfully');
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.toastr.warning(this.utils.getErrorMessage(error.code));
      })
      .finally(() => this.utils.closeSpinner());
  }

  sendPasswordResetEmail(email: string): void {
    sendPasswordResetEmail(this.firebaseAuth, email)
    .then((response) => {
      const notificationMsg = "We sent an email to " + email + "! If this email is connected to a Sticky Linkz account, you'll be able to reset your password.";
      this.toastr.success(notificationMsg, 'Email sent');
    })
    .catch((error) => {
      this.toastr.warning(this.utils.getErrorMessage(error.code));
    })
    .finally(() => this.utils.closeSpinner());
  }

}
