import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Import AngularFireAuth
import { FirebaseError } from 'firebase/app';  // To handle Firebase errors
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: any;
  registerForm: any;
  activeForm: 'login' | 'register' = 'login';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService  // Inject AuthService for Firebase Auth
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  toggleForm(form: 'login' | 'register') {
    this.activeForm = form;
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .then(() => {
          this.router.navigate(['/budget-planner/dashboard']);
        })
        .catch((error: FirebaseError) => {
          this.handleError(error);
        });
    } else {
      this.snackBar.open('Invalid email or password!', 'Close', { duration: 3000 });
    }
  }

  register() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService.register(email, password)
        .then(() => {
          this.snackBar.open('Registration successful! Redirecting to login...', 'Close', { duration: 3000 });
          setTimeout(() => {
            this.router.navigate(['/budget-planner/login']);
          }, 2000);
        })
        .catch((error: FirebaseError) => {
          this.handleError(error);
        });
    } else {
      this.snackBar.open('Please fill in all fields correctly!', 'Close', { duration: 3000 });
    }
  }

  private handleError(error: FirebaseError) {
    let errorMessage = 'An error occurred! Please try again.';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found!';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password!';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email is already in use!';
    }
    this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
  }
}
