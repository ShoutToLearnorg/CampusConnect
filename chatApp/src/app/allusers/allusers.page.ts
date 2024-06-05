import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service'; // Make sure the path is correct

@Component({
  selector: 'app-users',
  templateUrl: './allusers.page.html',
  styleUrls: ['./allusers.page.scss'],
})
export class AllusersPage implements OnInit {
  users: any[] = [];

  constructor(private authService: AuthService, private navCtrl: NavController) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.authService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  openSendMessagePage(recipient: string) {
    this.navCtrl.navigateForward(`/send-message/${recipient}`);
  }
}
