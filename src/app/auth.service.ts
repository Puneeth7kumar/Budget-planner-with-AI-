import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar  // Use MatSnackBar for displaying messages
  ) { }

  // Login method
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['dashboard']);  // Redirect to dashboard on success
      })
      .catch(error => {
        this.handleError(error);  // Handle errors properly
      });
  }

  // Register method
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.snackBar.open('Registration successful! Redirecting to login...', 'Close', { duration: 3000 });
        setTimeout(() => {
          this.router.navigate(['login']);  // Redirect to login after successful registration
        }, 2000);
      })
      .catch(error => {
        this.handleError(error);  // Handle errors properly
      });
  }

  // Logout method
  logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['login']);  // Redirect to login after logout
    });
  }

  // Method to check login state
  isLoggedIn() {
    return this.afAuth.authState;  // Return auth state for session checking
  }

  // Error handler
  private handleError(error: any) {
    let errorMessage = 'An error occurred! Please try again.';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already in use!';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format!';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak!';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found!';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password!';
    }
    this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
    console.error('Firebase error:', error);
  }
}
