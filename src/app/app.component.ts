import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./home/navbar/navbar.component";
import { LoginusernavbarComponent } from "./home/loginusernavbar/loginusernavbar.component";
import { AuthService } from './services/auth.service';
import { LoadingComponent } from "./loading/loading.component";
import { LoadingService } from './services/LoadingService';
import { Observable, filter } from 'rxjs';

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
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit() {
    // ✅ Loading observable
    this.isLoading$ = this.loadingService.loading$;

    // ✅ Set login status from token
    const hasToken = this.authService.isLoggedIn();
    this.authService['isLoggedInSubject'].next(hasToken);

    // ✅ Subscribe to login status updates
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
      console.log('Login status changed:', status);
    });

    // ✅ Routes where loading should be shown
    const loadingRoutes = ['/upload', '/parsed'];

    // 👉 Show loading only on selected routes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (loadingRoutes.some(path => event.url.startsWith(path))) {
          this.loadingService.setLoading(true);
        }
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loadingService.setLoading(false);
        }, 2000);
      }
    });

    // 👉 Scroll to top on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
