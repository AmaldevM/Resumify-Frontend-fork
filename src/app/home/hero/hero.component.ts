import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-hero',
  imports: [MatIconModule,
    MatButtonModule,
    MatCardModule,RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  public navigateToBrowse(): void {
    const loggedIn = this.authService.isLoggedIn();
    console.log('Is user logged in?', loggedIn);

    if (!loggedIn) {
      this.snackBar.open('⚠️ Please login first.', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    console.log('Navigating to /browse');
    this.router.navigate(['/browse']);
  }

}
