import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  router: any;
  authService: any;

  constructor(public auth: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.auth.logout();
    window.location.reload(); // Reload page or navigate to home/login
  }

onUploadResumeClick() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/browse']);
    } else {
      alert('Please login first to upload resume.');
      this.router.navigate(['/login']);
    }
  }
}
