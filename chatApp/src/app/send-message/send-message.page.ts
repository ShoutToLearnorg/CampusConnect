import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { IonContent, ToastController, PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessagePopoverComponent } from '../message-popover/message-popover.component';
import { AuthService } from '../../../services/auth.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.page.html',
  styleUrls: ['./send-message.page.scss'],
})
export class SendMessagePage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  recipient = '';
  recipientFullName = '';
  recipientStatus = '';
  recipientProfileIcon = '';
  newMessage = '';
  currentUser: any;
  messages: any[] = [];
  socket: any;
  profilePictureUrls: { [key: string]: string } = {};
  autoScroll = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.recipient = this.route.snapshot.paramMap.get('username') ?? '';
    this.authService.getCurrentUser().then(user => {
      if (user) {
        this.currentUser = user;
        this.loadProfilePictures([user.username, this.recipient]);
        this.initializeSocket();
        this.loadRecipientInfo();
        this.loadMessages();
        // Emit user online status when component initializes
        this.socket.emit('userOnline', this.currentUser.username);
      } else {
        this.showToast('User not logged in');
      }
    });
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  ngAfterViewInit() {
    this.scrollToBottomOnInit();
  }

  async presentPopover(ev: any, msg: any) {
    const popover = await this.popoverController.create({
      component: MessagePopoverComponent,
      componentProps: { message: msg },
      event: ev,
      translucent: true,
      cssClass: msg.sender === this.currentUser.username ? 'popover-right' : 'popover-left'
    });
    await popover.present();
  }

  loadMessages() {
    if (this.currentUser && this.recipient) {
      this.http.get<any[]>(`http://localhost:3000/api/messages/${this.currentUser.username}/${this.recipient}`).subscribe(
        data => {
          this.messages = data;
          this.loadProfilePictures([...new Set(data.map(msg => [msg.sender, msg.recipient]).flat())]);
          this.cdr.detectChanges();
          this.scrollToBottom();
        },
        error => {
          console.error('Error fetching messages:', error);
        }
      );
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) {
      this.showToast('Message cannot be empty');
      return;
    }

    if (this.currentUser && this.recipient) {
      const message = {
        sender: this.currentUser.username,
        recipient: this.recipient,
        message: this.newMessage,
        timestamp: new Date()
      };

      this.messages.push(message);
      this.newMessage = '';

      this.socket.emit('sendMessage', message);

      this.http.post('http://localhost:3000/api/messages/sendMessage', message).subscribe(
        response => {
          console.log('Message sent:', response);
          this.scrollToBottom();
        },
        error => {
          console.error('Error sending message:', error);
          this.showToast('Error sending message');
        }
      );
    }
  }

  showToast(message: string) {
    this.toastController.create({
      message,
      duration: 2000
    }).then(toast => toast.present());
  }

  loadProfilePictures(usernames: string[]) {
    usernames.forEach(username => {
      this.http.get<any>(`http://localhost:3000/api/users/${username}/profile-picture`).subscribe(
        response => {
          this.profilePictureUrls[username] = `http://localhost:3000${response.profilePictureUrl}`;
          if (username === this.recipient) {
            this.recipientProfileIcon = this.profilePictureUrls[username];
          }
        },
        error => {
          console.error('Error fetching profile picture:', error);
        }
      );
    });
  }

  getUserProfileIcon(username: string): string {
    return this.profilePictureUrls[username] || 'assets/default-profile.png';
  }

  loadRecipientInfo() {
    this.http.get<any>(`http://localhost:3000/api/users/${this.recipient}`).subscribe(
      response => {
        this.recipientFullName = response.fullName;
        this.recipientStatus = response.isOnline ? 'Online' : `Last seen: ${new Date(response.lastSeen).toLocaleString()}`;
        this.recipientProfileIcon = this.getUserProfileIcon(this.recipient);
      },
      error => {
        console.error('Error fetching recipient info:', error);
      }
    );
  }

  scrollToBottomOnInit() {
    this.content.scrollToBottom(0);
  }

  scrollToBottom() {
    if (this.autoScroll && this.content) {
      setTimeout(() => {
        this.content.scrollToBottom(0);
      }, 100); // Delay to ensure new messages are rendered
    }
  }

  initializeSocket() {
    this.socket = io('http://localhost:3000');
    this.socket.emit('register', this.currentUser.username);
  
    this.socket.on('receiveMessage', (message: any) => {
      if ((message.sender === this.currentUser.username && message.recipient === this.recipient) ||
          (message.sender === this.recipient && message.recipient === this.currentUser.username)) {
        this.messages.push(message);
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  
    // Listen for status updates
    this.socket.on('statusUpdate', (data: any) => {
      if (data.username === this.recipient) {
        this.recipientStatus = data.isOnline ? 'Online' : `Last seen: ${new Date(data.lastSeen).toLocaleString()}`;
        this.cdr.detectChanges();
      }
    });
  
    // Listen for disconnect event and update user last seen status
    this.socket.on('userDisconnected', (username: string) => {
      if (username === this.recipient) {
        this.recipientStatus = `Last seen: ${new Date().toLocaleString()}`;
        this.cdr.detectChanges();
      }
    });
  }
  
}
