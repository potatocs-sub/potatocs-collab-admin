import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { DialogService } from '../../../stores/dialog/dialog.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, MaterialsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  router = inject(Router);

  signInForm: FormGroup = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(15),
    ]),
  });

  signIn() {
    this.authService.signIn(this.signInForm.value).subscribe({
      next: (res: any) => {
        this.router.navigate(['/main']);
      },
      error: (err: any) => {
        console.log(err);
        if (err.status === 404) {
          this.dialogService.openDialogNegative(
            'This admin is not registered.'
          );
        } else if (err.status === 400) {
          this.dialogService.openDialogNegative('This is a retired admin.');
        } else if (err.status === 406) {
          this.dialogService.openDialogNegative('The password is incorrect.');
        } else {
          this.dialogService.openDialogNegative(err.error.message);
        }
      },
    });
  }
}
