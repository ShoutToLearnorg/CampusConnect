import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../chatApp/src/environments/environment'; // Ensure you have environment configuration

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: any;
  private apiUrl = environment.apiUrl;

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
    return this.http.post(`${this.apiUrl}/users/register`, userData).pipe(
      tap(response => console.log('User registered:', response)),
      catchError(this.handleError)
    );
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${username}`).pipe(
      tap(response => console.log('User data:', response)),
      catchError(this.handleError)
    );
  }

  updateProfile(username: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${username}/update-profile`, formData).pipe(
      tap(response => console.log('Profile updated:', response)),
      catchError(this.handleError)
    );
  }

  sendOtp(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, user).pipe(
      tap(response => console.log('OTP sent:', response)),
      catchError(this.handleError)
    );
  }

  verifyOtp(data: { otp: string, tempUserId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/verify-otp`, data).pipe(
      tap(response => console.log('OTP verified:', response)),
      catchError(this.handleError)
    );
  }

  createTempUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData).pipe(
      tap(response => console.log('Temporary user created:', response)),
      catchError(this.handleError)
    );
  }

  checkUsernameAvailability(username: string): Observable<{ available: boolean }> {
    return this.http.post<{ available: boolean }>(`${this.apiUrl}/users/check-username`, { username }).pipe(
      tap(response => console.log('Username availability:', response)),
      catchError(this.handleError)
    );
  }

  checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    return this.http.post<{ available: boolean }>(`${this.apiUrl}/users/check-email`, { email }).pipe(
      tap(response => console.log('Email availability:', response)),
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials).pipe(
      tap(async (response: any) => {
        console.log('Login response:', response);
        if (response.username && response.token) {
          await this.setToken(response.token);
          await this.setCurrentUser({ username: response.username });
          this.initializeSocket(response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  async setToken(token: string) {
    console.log('Setting token:', token);
    await this.storage.set('token', token);
  }

  async getToken() {
    const token = await this.storage.get('token');
    console.log('Retrieved token:', token);
    return token;
  }

  async setCurrentUser(user: any) {
    console.log('Setting current user:', user);
    // Securely set user info, consider not storing sensitive data in sessionStorage
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
    await this.storage.remove('token'); // Remove token instead of currentUser
    sessionStorage.removeItem('currentUser');
  }

  initializeSocket(token: string) {
    this.socket.ioSocket.io.opts.query = { token }; // Pass token securely
    this.socket.connect();
    console.log('Socket initialized');
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

  getProfilePicture(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/${username}/profile-picture`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      tap(response => console.log('Profile picture retrieved')),
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<any> {
    console.log(`Making GET request to ${this.apiUrl}/users`);
    return this.http.get(`${this.apiUrl}/users`).pipe(
      tap(response => console.log('All users:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('An unexpected error occurred. Please try again later.');
  }
}
