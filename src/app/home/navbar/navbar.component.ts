import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;

  constructor(public auth: AuthService, private router: Router) { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.auth.logout();
    window.location.reload();
  }

  isAdmin(): boolean {
    return this.auth.getRole() === 'admin';
  }

  onUploadResumeClick() {
    if (!this.auth.isLoggedIn()) {
      alert('Please login first to upload resume.');
      this.router.navigate(['/login']);
    } else if (!this.isAdmin()) {
      alert('Access Denied: Only admins can upload resumes.');
    } else {
      this.router.navigate(['/upload']);
    }
  }

  onParsedClick() {
    if (!this.auth.isLoggedIn()) {
      alert('Please login first to view parsed resumes.');
      this.router.navigate(['/login']);
    } else if (!this.isAdmin()) {
      alert('Access Denied: Only admins can view parsed resumes.');
    } else {
      this.router.navigate(['/parsedresumes']);
    }
  }
}
