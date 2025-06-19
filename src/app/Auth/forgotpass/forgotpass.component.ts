import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { log } from 'console';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.scss'],
})
export class ForgotpassComponent {
  emailForm: FormGroup;
  codeForm: FormGroup;
  passwordForm: FormGroup;

  step: 'email' | 'code' | 'reset' = 'email';
  emailValue: string = '';
  loading = false;
  // ✅ Add these to fix the errors
  errorMsg: string = '';
  isModalVisible: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });

    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get email() {
    return this.emailForm.get('email');
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  close(): void {
    this.isModalVisible = false;
    this.router.navigate(['/login']);
  }

  sendCode(): void {
  if (this.emailForm.valid) {
    this.loading = true;
    const email = this.emailForm.value.email;

    this.authService.sendResetCode(email).subscribe({
      next: (res) => {
        console.log(res);

        this.emailValue = email;
        this.step = 'code';
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
         console.log(err);
        this.errorMsg = err?.error?.message || 'Error sending reset code';
      },
    });
  }
}


 verifyCode(): void {
  if (this.codeForm.valid) {
    this.loading = true;
    const code = this.codeForm.value.code;
    this.authService.verifyResetCode(this.emailValue,code).subscribe({
      next: () => {
        this.step = 'reset';
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Invalid or expired code';
      },
    });
  }
}

  resetPassword(): void {
    if (this.passwordForm.invalid) return;

    const { password, confirmPassword } = this.passwordForm.value;
    if (password !== confirmPassword) {
      this.errorMsg = 'Passwords do not match!';
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.emailValue,password).subscribe({
      next: () => {
        alert('Password updated successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Failed to reset password';
      },
    });
  }
}
