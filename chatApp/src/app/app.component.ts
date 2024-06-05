import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userData: any = {};
  profilePictureUrl: string = '';
  username: string = '';
  isUserLoggedIn: boolean = false; // New property to track login status

  constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().then(user => {
      if (user && user.username) {
        this.isUserLoggedIn = true; // Set login status to true
        this.username = user.username;
        console.log('Fetched username from AuthService:', this.username); // Debug statement
        this.fetchUserData(this.username);
        this.fetchProfilePicture(this.username);
      } else {
        console.error('Username not found in AuthService');
        this.isUserLoggedIn = false; // Ensure login status is false
      }
    });
  }

  fetchUserData(username: string) {
    console.log(`Fetching user data for: ${username}`); // Debug statement
    this.http.get<any>(`http://localhost:3000/api/users/${username}`).subscribe(
      (response) => {
        console.log('User data fetched:', response); // Debug statement
        this.userData = response;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  fetchProfilePicture(username: string) {
    console.log(`Fetching profile picture for: ${username}`); // Debug statement
    this.http.get<any>(`http://localhost:3000/api/users/${username}/profile-picture`).subscribe(
      (response) => {
        console.log('Profile picture response:', response); // Debug statement
        this.profilePictureUrl = `http://localhost:3000${response.profilePictureUrl}`;
      },
      (error) => {
        console.error('Error fetching profile picture:', error);
      }
    );
  }
}
