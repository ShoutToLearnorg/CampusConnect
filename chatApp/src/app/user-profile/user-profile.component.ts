import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service'; // Adjust the path as necessary
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: any;
  isEditing = false;
  selectedFile: File | null = null;
  @ViewChild('fileInput') fileInput: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private toastController: ToastController
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      college: [''],
      department: ['']
    });
  }

  async ngOnInit() {
    try {
      await this.loadCurrentUser();
    } catch (error) {
      console.error('Error loading current user:', error);
      this.showToast('Error loading user profile');
    }
  }

  async loadCurrentUser() {
    console.log('Fetching current user...');
    try {
      this.currentUser = await this.authService.getCurrentUser();
      console.log('Current user:', this.currentUser);
      
      if (this.currentUser) {
        this.profileForm.patchValue({
          fullName: this.currentUser.fullName,
          college: this.currentUser.college,
          department: this.currentUser.department
        });
      } else {
        console.error('No current user found');
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  }

  enableEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  onFileSelected(event: any) {
    console.log('File selected:', event.target.files[0]);
    this.selectedFile = event.target.files[0];
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      const formData = new FormData();
      formData.append('fullName', this.profileForm.get('fullName')?.value);
      formData.append('college', this.profileForm.get('college')?.value);
      formData.append('department', this.profileForm.get('department')?.value);

      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile);
      }

      try {
        const user = await this.authService.getCurrentUser();
        if (user) {
          this.http.post(`http://localhost:3000/users/${user.username}`, formData).subscribe(
            async (response: any) => {
              await this.authService.setCurrentUser(response);
              this.currentUser = response;
              this.isEditing = false;
              this.showToast('Profile updated successfully');
            },
            (error) => {
              console.error('Error updating profile:', error);
              this.showToast('Error updating profile');
            }
          );
        }
      } catch (error) {
        console.error('Failed to fetch current user for update:', error);
        this.showToast('Error updating profile');
      }
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  getProfilePictureUrl(): string {
    return this.currentUser ? `http://localhost:3000/uploads/${this.currentUser.profilePicture}` : '';
  }
}
