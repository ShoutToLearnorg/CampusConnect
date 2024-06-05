import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-users',
  templateUrl: './allusers.page.html',
  styleUrls: ['./allusers.page.scss'],
})
export class AllusersPage implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient, private navCtrl: NavController) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get('http://localhost:3000/users').subscribe(
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