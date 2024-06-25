import { Injectable } from '@angular/core';
import { Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
 } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGaurd: boolean = false;

  constructor(
    private firebaseAuth: Auth,
    private toastr: ToastrService,
    private router: Router
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
      this.setUserData();
      this.toastr.success('Registered Sucessfully');
      this.router.navigate(['/dashboard']);

      // updateProfile(response.user, { displayName: name });
    }
    );
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    )
      .then(() => {
        this.setUserData();
        this.toastr.success('Logged in Sucessfully');
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        this.toastr.warning('Invalid username or password');
        throw new Error(error);
      });
    return from(promise);
  }

  logout() {
    const promise = signOut(this.firebaseAuth)
      .then(() => {
        this.removeUserData();
        this.toastr.success('Logged out Sucessfully');
        this.router.navigate(['/login']);
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
}
