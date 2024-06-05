import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service'; // Adjust the path as necessary
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  currentUser: any;
  selectedUser: any;
  searchTerm: string = '';
  newMessage: string = '';
  isDropdownOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUser();
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const response: any = await this.http.get('http://localhost:3000/users').toPromise();
      this.users = response.filter((user: any) => user.username !== this.currentUser.username);
      this.filteredUsers = this.users;
  
      // Fetch profile pictures for all users
      for (const user of this.users) {
        user.profilePictureUrl = await this.getProfilePictureUrl(user.username);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }
  

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openChat(user: any) {
    this.selectedUser = user;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      // Logic to send the message
      console.log('Message sent to', this.selectedUser.username, ':', this.newMessage);
      this.newMessage = '';
    }
  }


  getProfilePictureUrl(user: any): string {
    const url = `http://localhost:3000/uploads/${user.profilePicture}`;
    console.log('Generated URL:', url); // Log the generated URL
    return url;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  goToEditProfile() {
    this.isDropdownOpen = false;
    this.router.navigate(['/edit-profile']);
  }
}
