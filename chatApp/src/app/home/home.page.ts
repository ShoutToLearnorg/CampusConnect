import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  username: string = '';
  isUserLoggedIn: boolean = false;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      if (user && user.username) {
        this.isUserLoggedIn = true;
        this.username = user.username;
        console.log('Fetched username from AuthService:', this.username);
      } else {
        this.isUserLoggedIn = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
