import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {
  profileForm: FormGroup;
  profilePicture: File | null = null;
  profilePictureUrl: string | null = null;
  username: string = ''; // Initialize the property

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      department: ['', Validators.required],
    });
  }



  async ngOnInit() {
    const usernameParam = this.route.snapshot.paramMap.get('username');
  this.username = usernameParam || ''; 

    const currentUser = await this.authService.getCurrentUser();
    this.username = currentUser.username;
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getUserByUsername(this.username).subscribe(
      (user) => {
        this.profileForm.patchValue({
          fullName: user.fullName,
          department: user.department,
        });
        if (user.profilePicture) {
          this.profilePictureUrl = `http://localhost:3000/uploads/${user.profilePicture}`;
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  onFileChange(event: any) {
    this.profilePicture = event.target.files[0];
  }

  async updateProfile() {
    try {
      const formData = new FormData();
      formData.append('fullName', this.profileForm.value.fullName);
      formData.append('department', this.profileForm.value.department);
      if (this.profilePicture) {
        formData.append('profilePicture', this.profilePicture);
      }

      await this.authService.updateProfile(this.username, formData).toPromise();

      // Show success toast message
      const toast = await this.toastController.create({
        message: 'Profile updated successfully',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();

      this.loadUserProfile(); // Reload profile to reflect changes
    } catch (error) {
      // Show error toast message
      const toast = await this.toastController.create({
        message: 'Failed to update profile',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    }
  }
}
