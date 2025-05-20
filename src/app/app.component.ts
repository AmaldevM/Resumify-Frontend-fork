import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./home/navbar/navbar.component";
import { LoginusernavbarComponent } from "./home/loginusernavbar/loginusernavbar.component";
import { AuthService } from './services/auth.service'; // ✅ import

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
    LoginusernavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'resumify';
  isLoggedIn = true;

  constructor(private authService: AuthService) {}

 ngOnInit() {
  // 👇 Explicitly check and set the latest login status
  const hasToken = this.authService.isLoggedIn();
  this.authService['isLoggedInSubject'].next(hasToken); // force update

  this.authService.isLoggedIn$.subscribe((status: boolean) => {
    this.isLoggedIn = status;
    console.log('Login status changed:', status);
  });
}

}
