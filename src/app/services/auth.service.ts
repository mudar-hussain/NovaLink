import { Injectable } from '@angular/core';
import { Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
 } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGaurd: boolean = false;

  constructor(
    private firebaseAuth: Auth,
    private toastr: ToastrService,
    private router: Router,
    private utils: UtilsService
  ) { }

  register(
    email: string,
    name: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      updateProfile(response.user, { displayName: name });
      this.setUserData();
      this.toastr.success('Registered Sucessfully');
      this.router.navigate(['/']);
    }
    );
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    this.utils.openSpinner();
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
      .then(() => {
        this.setUserData();
        this.toastr.success('Logged in Sucessfully');
        this.router.navigate(['/']);
        this.utils.closeSpinner();
      })
      .catch((error) => {
        this.toastr.warning('Invalid username or password');
        this.utils.closeSpinner();
        throw new Error(error);
      });
    return from(promise);
  }

  async loginWithGoogle() {
    // Sign in using a redirect.
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    auth.useDeviceLanguage();
    provider.addScope('profile');
    provider.addScope('email');

  signInWithPopup(auth, provider)
  .then((result) => {
    this.setUserData();
    this.toastr.success('Logged in Sucessfully');
    this.router.navigate(['/']);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    console.log(user);
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }

  logout() {
    const promise = signOut(this.firebaseAuth)
      .then(() => {
        this.removeUserData();
        this.toastr.success('Logged out Sucessfully');
        this.router.navigate(['/']);
      })
      .catch((error: string | undefined) => {
        throw new Error(error);
      });
    return from(promise);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  setUserData() {
    const userData = JSON.stringify(this.firebaseAuth.currentUser);
    sessionStorage.setItem('user', userData);
    this.loggedIn.next(true);
    this.isLoggedInGaurd = true;
  }

  removeUserData() {
    sessionStorage.clear();
    this.loggedIn.next(false);
    this.isLoggedInGaurd = false;
  }

  getUserData() {
    const user = sessionStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    } else {
    return null;
    }
  }
}
