import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { ForgotpassComponent } from './Auth/forgotpass/forgotpass.component';
import { SelectedFilesComponent } from './selectedfiles/selectedfiles.component';
import { ResumeEnhancingComponent } from './resume-enhancing/resume-enhancing.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  // ✅ Default route to home
  { path: '', component: HomeComponent },

  // ✅ Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotpassComponent },

  // ✅ Feature routes with lazy loading + auth guard
  {
    path: 'upload',
    loadComponent: () =>
      import('./browseresume/browseresume.component').then(
        m => m.BrowseResumeComponent
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'parsedresumes',
    loadComponent: () =>
      import('./parsedresume/parsedresume.component').then(
        m => m.ParsedresumeComponent
      ),
    canActivate: [AuthGuard]
  },

  // ✅ Public routes
  { path: 'enhance', component: ResumeEnhancingComponent },
  { path: 'selectedfiles', component: SelectedFilesComponent },

  // ✅ Utility/test routes (optional)
  {
    path: 'loading',
    loadComponent: () =>
      import('./loading/loading.component').then(m => m.LoadingComponent)
  },
  {
    path: 'animload',
    loadComponent: () =>
      import('./animload/animload.component').then(m => m.AnimLoadingComponent)
  },

  // ✅ Catch-all route at the end
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
