import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.authService.getCurrentUser();
    if (this.authService.isLoggedIn()) {
      // If user is logged in, allow access
      return true;
    } else {
      // If user is not logged in, redirect to the registration page
      this.router.navigate(['/register']);
      return false;
    }
  }
}
