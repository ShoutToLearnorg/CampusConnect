import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Import Router service

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userData: any = {};
  profilePictureUrl: string = '';
  username: string = '';
  isUserLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router // Inject Router service
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.authService.getCurrentUser().then(user => {
      if (user && user.username) {
        this.isUserLoggedIn = true;
        this.username = user.username;
        console.log('Fetched username from AuthService:', this.username);
        this.fetchUserData(this.username);
        this.fetchProfilePicture(this.username);
      } else {
        console.error('Username not found in AuthService');
        this.isUserLoggedIn = false;
      }
    }).catch(error => {
      console.error('Error fetching current user:', error);
      this.isUserLoggedIn = false;
    });
  }

  fetchUserData(username: string) {
    console.log(`Fetching user data for: ${username}`);
    this.http.get<any>(`http://localhost:3000/api/users/${username}`).subscribe(
      response => {
        console.log('User data fetched:', response);
        this.userData = response;
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  fetchProfilePicture(username: string) {
    console.log(`Fetching profile picture for: ${username}`);
    this.http.get<any>(`http://localhost:3000/api/users/${username}/profile-picture`).subscribe(
      response => {
        console.log('Profile picture response:', response);
        this.profilePictureUrl = `http://localhost:3000${response.profilePictureUrl}`;
      },
      error => {
        console.error('Error fetching profile picture:', error);
      }
    );
  }

  goToUserProfile() {
    this.authService.getCurrentUser().then(user => {
      if (user && user.username) {
        console.log('Navigating to user profile:', user.username);
        this.router.navigate([`/${user.username}`]);
      } else {
        console.error('User is not logged in or username is not available');
      }
    }).catch(error => {
      console.error('Error fetching current user for navigation:', error);
    });
  }
}