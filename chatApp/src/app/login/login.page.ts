import { Component } from '@angular/core';
import { AuthService } from 'services/auth.service'; // Adjust the path as per your project structure
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    try {
      const response: any = await this.authService.login({ email: this.email, password: this.password }).toPromise();
      console.log('Login successful:', response); // Log the successful login
      await this.authService.setToken(response.token);
      await this.authService.setCurrentUser({ username: response.username });
      this.router.navigate(['/allusers']);
    } catch (error) {
      console.error('Error logging in:', error);
      this.showToast('Invalid credentials. Please try again.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
