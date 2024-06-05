import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {

  userData: any = {};
  profilePictureUrl: string = '';
  username: string = '';
  isAccountHolder: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient, 
    private authService: AuthService, 
    private navCtrl: NavController,
    private router: Router // Add Router to constructor
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
        this.fetchUserData(this.username);
        this.fetchProfilePicture(this.username);
      }
    });

    this.authService.getCurrentUser().then(user => {
      if (user && user.username) {
        this.isLoggedIn = true;
        this.isAccountHolder = (user.username === this.username);
      } else {
        this.isLoggedIn = false;
        this.isAccountHolder = false;
      }
    });
  }

  fetchUserData(username: string) {
    this.http.get<any>(`http://localhost:3000/api/users/${username}`).subscribe(
      (response) => {
        this.userData = response;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  fetchProfilePicture(username: string) {
    this.http.get<any>(`http://localhost:3000/api/users/${username}/profile-picture`).subscribe(
      (response) => {
        this.profilePictureUrl = `http://localhost:3000${response.profilePictureUrl}`;
      },
      (error) => {
        console.error('Error fetching profile picture:', error);
      }
    );
  }

  openSendMessagePage(recipient: string) {
    this.navCtrl.navigateForward(`/send-message/${recipient}`);
  }

  async logout() {
    await this.authService.removeCurrentUser();
    this.authService.disconnectSocket();
    this.router.navigate(['/register']);
  }
}
