import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FooterComponent } from "./footer/footer.component";
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeroComponent } from "./hero/hero.component";
import { AboutComponent } from './about/about.component';
import { LoadingService } from '../services/LoadingService';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FooterComponent,
    HeroComponent,
    AboutComponent,
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  showLoginOverlay = false;
  showRegisterOverlay = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private loadingService: LoadingService

  ) {}




  openLoginOverlay() {
    this.showLoginOverlay = true;
    this.showRegisterOverlay = false;
  }

  openRegisterOverlay() {
    this.showRegisterOverlay = true;
    this.showLoginOverlay = false;
  }

  closeOverlay() {
    this.showLoginOverlay = false;
    this.showRegisterOverlay = false;
  }


  ngOnInit(): void {
    // Smooth scroll to section based on fragment
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100); // Delay ensures DOM is loaded
        }
      }
    });
  }

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
  }
}
