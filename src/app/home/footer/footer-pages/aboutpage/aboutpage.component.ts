import { Component } from '@angular/core';
import { FooterComponent } from "../../footer.component";


@Component({
  selector: 'app-aboutpage',
  standalone: true,
  templateUrl: './aboutpage.component.html',
  styleUrls: ['./aboutpage.component.scss'],
  imports: [FooterComponent]
})
export class AboutpageComponent { }
