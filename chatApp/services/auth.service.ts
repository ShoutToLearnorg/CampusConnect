import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { tap, catchError, takeUntil } from 'rxjs/operators';
import { Observable, throwError, BehaviorSubject, Subject, from } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { environment } from '../../chatApp/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;
  private baseUrl = environment.baseUrl;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private storage: Storage, private socket: Socket) {
    this.initStorage();
  }

  async initStorage() {
    this.storage = await this.storage.create();
    console.log('Storage initialized');
    const storedUser = await this.getCurrentUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData).pipe(
      tap(response => console.log('User registered:', response)),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    );
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${username}`).pipe(
      tap(response => console.log('User data:', response)),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    );
  }

  updateProfile(username: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${username}/update-profile`, formData).pipe(
      tap(response => console.log('Profile updated:', response)),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    );
  }

  sendOtp(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, user).pipe(
      tap(response => console.log('OTP sent:', response)),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    );
  }

  verifyOtp(data: { otp: string, tempUserId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/verify-otp`, data).pipe(
      tap(response => console.log('OTP verified:', response)),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    );
  }

  createTempUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData).pipe(
      tap(response => console.log('Temporary user created:', response)),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    );
  }

  checkUsernameAvailability(username: string): Observable<{ available: boolean }> {
    return this.http.post<{ available: boolean }>(`${this.apiUrl}/users/check-username`, { username }).pipe(
      tap(response => console.log('Username availability:', response)),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    );
  }

  checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    return this.http.post<{ available: boolean }>(`${this.apiUrl}/users/check-email`, { email }).pipe(
      tap(response => console.log('Email availability:', response)),
      catchError(this.handleError),
      takeUntil(this.destroy$)
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
      catchError(this.handleError),
      takeUntil(this.destroy$)
    );
  }

  async setToken(token: string) {
    await this.storage.set('token', token);
  }

  getToken(): Observable<string | null> {
    return from(this.storage.get('token'));
  }

  //for production

  // async setToken(token: string) {
  //   document.cookie = `token=${token}; Secure; HttpOnly; SameSite=Strict`;
  // }

  // async getToken() {
  //   const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  //   return match ? match[2] : null;
  // }


  async setCurrentUser(user: any) {
    console.log('Setting current user:', user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  async getCurrentUser() {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.currentUserSubject.next(parsedUser);
      return parsedUser;
    }
    return null;
  }

  async removeCurrentUser() {
    this.currentUserSubject.next(null);
    await this.storage.remove('token');
    sessionStorage.removeItem('currentUser');
  }

  initializeSocket(token: string) {
    this.socket.ioSocket.io.opts.query = { token };
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
    return this.socket.fromEvent('receiveMessage').pipe(
      takeUntil(this.destroy$)
    );
  }

  getProfilePicture(username: string): Observable<string> {
    const url = `${this.apiUrl}/users/${username}/profile-picture`;

    return this.http.get<{ profilePictureUrl: string }>(url).pipe(
      map(response => `${this.baseUrl}${response.profilePictureUrl}`),
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`).pipe(
      tap(response => console.log('All users:', response)),
      catchError(this.handleError),
      takeUntil(this.destroy$)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(() => new Error('An unexpected error occurred. Please try again later.'));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnectSocket();
    this.currentUserSubject.complete();
  }
}
