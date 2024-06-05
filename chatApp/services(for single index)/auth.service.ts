import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: any;

  constructor(private http: HttpClient, private storage: Storage, private socket: Socket) {
    this.initStorage();
  }

  async initStorage() {
    this.storage = await this.storage.create();
    console.log('Storage initialized');
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  register(userData: any): Observable<any> {
    return this.http.post('http://localhost:3000/register', userData);
  }

  sendOtp(user: any): Observable<any> {
    return this.http.post('http://localhost:3000/send-otp', user);
  }

  verifyOtp(data: { otp: string, tempUserId: string }): Observable<any> {
    return this.http.post('http://localhost:3000/verify-otp', data);
  }

  login(credentials: any): Observable<any> {
    return this.http.post('http://localhost:3000/login', credentials).pipe(
      tap(async (response: any) => {
        console.log('Login response:', response);
        if (response.username && response.token) {
          await this.setToken(response.token);
          await this.setCurrentUser({ username: response.username });
          this.initializeSocket(response.username);
        }
      })
    );
  }

  async setToken(token: string) {
    await this.storage.set('token', token);
  }

  async getToken() {
    return await this.storage.get('token');
  }

  async setCurrentUser(user: any) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  async getCurrentUser() {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
    return this.currentUser;
  }

  async removeCurrentUser() {
    this.currentUser = null;
    await this.storage.remove('currentUser');
  }

  initializeSocket(username: string) {
    this.socket.connect();
    this.socket.emit('register', username);
    console.log('Socket initialized for user:', username);
  }

  disconnectSocket() {
    this.socket.disconnect();
    console.log('Socket disconnected');
  }

  sendMessage(sender: string, recipient: string, message: string) {
    this.socket.emit('sendMessage', { sender, recipient, message });
  }

  onMessage(): Observable<any> {
    return this.socket.fromEvent('receiveMessage');
  }
}
