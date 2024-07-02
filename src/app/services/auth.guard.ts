import { Injectable, NgZone, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private ngZone: NgZone
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    //your logic goes here
    if (this.authService.isLoggedIn) {
      return true;
    } else {
      this.toastr.warning('Access Denied!');
      this.ngZone.run(() => {
        this.router.navigate(['/']);
      });
      return false;
    }
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(PermissionsService).canActivate(next, state);
};
