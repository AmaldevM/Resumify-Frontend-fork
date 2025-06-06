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
  { path: 'help', loadComponent: () => import('./home/footer/footer-pages/help/help.component').then(m => m.HelpComponent) },
  { path: 'contact', loadComponent: () => import('./home/footer/footer-pages/contactus/contactus.component').then(m => m.ContactusComponent) },
  { path: 'privacy-policy', loadComponent: () => import('./home/footer/footer-pages/privacypolicy/privacypolicy.component').then(m => m.PrivacypolicyComponent) },
  { path: 'terms-of-service', loadComponent: () => import('./home/footer/footer-pages/termsofservice/termsofservice.component').then(m => m.TermsofserviceComponent) },
  { path: 'gdpr-ccpa', loadComponent: () => import('./home/footer/footer-pages/gdrp-ccpa/gdrp-ccpa.component').then(m => m.GDRPCCPAComponent) },
  { path: 'about', loadComponent: () => import('./home/footer/footer-pages/aboutpage/aboutpage.component').then(m => m.AboutpageComponent) },
  { path: 'careers', loadComponent: () => import('./home/footer/footer-pages/careers/careers.component').then(m => m.CareersComponent) },
  { path: 'pricing', loadComponent: () => import('./home/footer/footer-pages/pricing/pricing.component').then(m => m.PricingComponent) },
  { path: 'blog', loadComponent: () => import('./home/footer/footer-pages/blog/blog.component').then(m => m.BlogComponent) },
  { path: 'press', loadComponent: () => import('./home/footer/footer-pages/press/press.component').then(m => m.PressComponent) },

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
