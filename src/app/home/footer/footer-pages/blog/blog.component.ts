import { Component } from '@angular/core';
import { FooterComponent } from '../../footer.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent { }
