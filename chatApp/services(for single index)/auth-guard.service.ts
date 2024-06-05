import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    await this.authService.getCurrentUser(); // Wait for the user to be fetched
    if (this.authService.isLoggedIn()) {
      return true; // User is authenticated, allow access to the route
    } else {
      this.router.navigate(['/login']); // Redirect to the login page if not authenticated
      return false;
    }
  }
}
