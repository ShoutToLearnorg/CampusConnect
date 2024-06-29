import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, debounceTime, switchMap, catchError, first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, AfterViewInit {
  registerForm!: FormGroup;
  otpForm!: FormGroup;
  email: string = '';
  password: string = '';
  otpSent = false;
  tempUserId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngAfterViewInit() {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    sign_up_btn?.addEventListener("click", () => {
      container?.classList.add("sign-up-mode");
    });

    sign_in_btn?.addEventListener("click", () => {
      container?.classList.remove("sign-up-mode");
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern('^[a-z0-9_]*$')
        ],
        [this.usernameValidator()]
      ],
      fullName: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ],
        [this.emailValidator()]
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      department: ['', [Validators.required]]
    });

    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required]]
    });
  }

  async login() {
    try {
      const response: any = await this.authService.login({ email: this.email, password: this.password }).toPromise();
      console.log('Login successful:', response);
      await this.authService.setToken(response.token);
      await this.authService.setCurrentUser({ username: response.username });
      // Redirect to user page with username as route parameter
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error logging in:', error);
      this.showToast('Invalid credentials. Please try again.');
    }
  }

  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(300),
        switchMap((username: string) =>
          this.authService.checkUsernameAvailability(username).pipe(
            map((res: { available: boolean }) => res.available ? null : { usernameTaken: true }),
            catchError(() => of(null))
          )
        ),
        first()
      );
    };
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return control.valueChanges.pipe(
        debounceTime(300),
        switchMap((email: string) =>
          this.authService.checkEmailAvailability(email).pipe(
            map((res: { available: boolean }) => res.available ? null : { emailTaken: true }),
            catchError(() => of(null))
          )
        ),
        first()
      );
    };
  }

  async onRegister() {
    if (this.registerForm.valid) {
      const loading = await this.presentLoading();  // Show loading indicator
  
      this.authService.createTempUser(this.registerForm.value).subscribe(
        async (response) => {
          await loading.dismiss();  // Hide loading indicator
          console.log('Temporary user created and OTP sent:', response);
          this.tempUserId = response.tempUserId; // Store the temporary user ID
          console.log('Temporary user ID:', this.tempUserId); // Verify tempUserId
          this.otpSent = true;
          const toast = await this.toastController.create({
            message: 'OTP sent to your email',
            duration: 2000,
            color: 'success'
          });
          toast.present();
        },
        async (error) => {
          await loading.dismiss();  // Hide loading indicator
          console.error('Error creating temporary user:', error);
          const errorMessage = error.error?.message || 'Internal Server Error';
          const toast = await this.toastController.create({
            message: errorMessage,
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      );
    } else {
      this.markFormGroupTouched(this.registerForm);
      const toast = await this.toastController.create({
        message: 'Please fill out all required fields correctly.',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
    }
  }
  
  async onVerifyOtp() {
    if (this.otpForm.valid && this.tempUserId) {
      const loading = await this.presentLoading();  // Show loading indicator
  
      const otpData = { otp: this.otpForm.value.otp, tempUserId: this.tempUserId };
      console.log('Sending OTP verification request with data:', otpData);
      try {
        const response = await this.authService.verifyOtp(otpData).toPromise();
        await loading.dismiss();  // Hide loading indicator
  
        // Assuming the response contains the token and user details
        await this.authService.setToken(response.token);
        await this.authService.setCurrentUser({ username: response.username });
  
        this.showToast('Registration successful!');
  
        // Construct the URL with the username
        const username = this.registerForm.value.username;
        const url = `/${username}`; // Adjust this if you have a base URL
  
        // Login user after successful OTP verification
        this.email = this.registerForm.value.email;  // Set the email for login
        this.password = this.registerForm.value.password;  // Set the password for login
        await this.login();  // Call the login method to log in the user
  
        // Navigate to the home page after login
        this.router.navigate(['/${username']);
      } catch (error) {
        await loading.dismiss();  // Hide loading indicator
        console.error('Error during OTP verification:', error);
        this.showToast('Invalid OTP. Please try again.');
      }
    } else {
      this.showToast('Please enter the OTP.');
    }
  }
  
  
  
  

  


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Processing...',
      spinner: 'circles',
      duration: 5000  // Optional: Auto-hide after a certain period to avoid infinite loading
    });
    await loading.present();
    return loading;
  }

  goBackToRegister() {
    this.otpSent = false;
  }
  

}
