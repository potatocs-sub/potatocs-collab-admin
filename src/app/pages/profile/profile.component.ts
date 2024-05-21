import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MaterialsModule } from '../../materials/materials.module';
import { DialogService } from '../../stores/dialog/dialog.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProfileService } from '../../services/user/profile.service';
import { confirmPasswordValidator } from './confirm-password.validator';

export const comparePasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { isNotMatched: true }
    : null;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MaterialsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profileService = inject(ProfileService);
  dialogService = inject(DialogService);
  fb = inject(FormBuilder);

  profile_img: any;
  email: any;
  _id: any;

  editProfileForm: FormGroup = this.fb.group(
    {
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
      ]),
    },
    { validators: confirmPasswordValidator }
  );
  router: any;

  // isLoadingResults = signal<boolean>(true);
  // isRateLimitReached = signal<boolean>(false);

  constructor() {
    this.getProfile();
  }

  getProfile() {
    console.log('들어옴');
    this.profileService.getUserProfile().subscribe((res: any) => {
      console.log(res);

      this.profile_img = res.profile_img;
      this.email = res.email;
      this._id = res._id;

      this.editProfileForm.patchValue({
        name: res.name,
      });
    });
  }

  fileChangeEvent(event: any) {
    console.log(this.editProfileForm);
    if (event.target.files && event.target.files[0]) {
      if (
        event.target.files[0].name.toLowerCase().endsWith('.jpg') ||
        event.target.files[0].name.toLowerCase().endsWith('.png')
      ) {
        // Image resize and update
        this.changeProfileImage(event.target.files[0]);
      } else {
        this.dialogService.openDialogNegative(
          'Profile photos are only available for PNG and JPG.'
        );
        // alert('프로필 사진은 PNG와 JPG만 가능합니다.');
      }
    } else {
      this.dialogService.openDialogNegative('Can not bring up pictures.');
      // alert('사진을 불러올 수 없습니다.');
    }
  }

  changeProfileImage(imgFile: File) {
    this.profileService.changeProfileImg(imgFile, this._id).subscribe({
      next: (res: any) => {
        this.getProfile();
      },
      error: (error: any) => {
        console.log(error);
        if (error.status === 413) {
          this.getProfile();
          this.dialogService.openDialogNegative(
            'The file size is too large. Must be less than 15M.'
          );
        } else {
          this.dialogService.openDialogNegative('change profile Error');
        }
      },
    });
  }

  onSubmit() {
    console.log(this.editProfileForm.errors?.['isNotMatched']);
    if (this.editProfileForm.valid) {
      if (!this.editProfileForm.errors?.['isNotMatched']) {
        const patchData = {
          ...this.editProfileForm.value,
          _id: this._id,
        };

        // updateForm 중 값이 ''이면 객체에서 삭제. patch 시 변경될 값만 설정
        for (const key in patchData) {
          if (patchData.hasOwnProperty(key) && patchData[key] === '') {
            delete patchData[key];
          }
        }

        console.log(patchData);

        this.profileService.updateProfile(patchData).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.getProfile();
              this.dialogService.openDialogPositive(
                'Successfully, Profile has been updated'
              );
            }
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      }
    }
  }
}

