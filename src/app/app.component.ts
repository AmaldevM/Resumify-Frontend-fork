import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./home/navbar/navbar.component";
import { LoginusernavbarComponent } from "./home/loginusernavbar/loginusernavbar.component";
import { AuthService } from './services/auth.service';
import { LoadingComponent } from "./loading/loading.component";
import { LoadingService } from './services/LoadingService';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    NavbarComponent,
    LoginusernavbarComponent,
    LoadingComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'resumify';
  isLoggedIn = false;
  isLoading$!: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    // ✅ Bind loading observable once
    this.isLoading$ = this.loadingService.loading$;

    // ✅ Set initial login status from token
    const hasToken = this.authService.isLoggedIn();
    this.authService['isLoggedInSubject'].next(hasToken);

    // ✅ Subscribe to login status changes
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
      console.log('Login status changed:', status);
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
