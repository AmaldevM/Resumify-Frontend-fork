import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http'; // ✅ Import this

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {


    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
     password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')]]

    });
  }

onSubmit(): void {
  if (this.registerForm.valid) {
    console.log("Sending:", this.registerForm.value);
    this.auth.register(this.registerForm.value).subscribe({
      next: (res) => {
        console.log("Registration response:", res);
        alert('Registration successful! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Registration failed', err);
        alert('Registration failed. Please try again.');
      }
    });
  } else {
    console.warn("Form invalid", this.registerForm.value);
  }
}
showPassword: boolean = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}






  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }
}
