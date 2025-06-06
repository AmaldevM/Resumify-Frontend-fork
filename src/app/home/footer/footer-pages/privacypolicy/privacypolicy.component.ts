import { Component } from '@angular/core';
import { FooterComponent } from '../../footer.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-privacypolicy',
  standalone: true,
  imports: [FooterComponent,MatIconModule],
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss']
})
export class PrivacypolicyComponent { }
