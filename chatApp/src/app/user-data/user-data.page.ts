import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // Adjust the import path as needed

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit, OnDestroy {
  userData: any = {};
  profilePictureUrl: string = '';
  username: string = '';
  isAccountHolder: boolean = false;
  isLoggedIn: boolean = false;
  userSubscription: Subscription | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
        this.fetchUserData(this.username);
        this.fetchProfilePicture(this.username); // Fetch profile picture even if not logged in
      }
    });

    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user && user.username) {
        this.isLoggedIn = true;
        this.isAccountHolder = (user.username === this.username);
        if (this.isAccountHolder) {
          this.fetchUserData(user.username);
        }
      } else {
        this.isLoggedIn = false;
        this.isAccountHolder = false;
        this.resetUserData();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchUserData(username: string) {
    this.http.get<any>(`http://localhost:3000/api/users/${username}`).subscribe(
      response => {
        this.userData = response;
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  fetchProfilePicture(username: string) {
    this.http.get<any>(`http://localhost:3000/api/users/${username}/profile-picture`).subscribe(
      response => {
        this.profilePictureUrl = `http://localhost:3000${response.profilePictureUrl}`;
      },
      error => {
        console.error('Error fetching profile picture:', error);
      }
    );
  }

  resetUserData() {
    this.userData = {};
    this.profilePictureUrl = '';
  }

  async logout() {
    try {
      await this.authService.removeCurrentUser();
      this.authService.disconnectSocket();
      this.router.navigate(['/register']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  openSendMessagePage(recipient: string) {
    this.navCtrl.navigateForward(`/send-message/${recipient}`);
  }
}
