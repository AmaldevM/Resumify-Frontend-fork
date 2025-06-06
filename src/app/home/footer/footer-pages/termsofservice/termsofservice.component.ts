import { Component } from '@angular/core';
import { FooterComponent } from "../../footer.component";
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-termsofservice',
  standalone: true,
  imports: [FooterComponent,MatIconModule],
  templateUrl: './termsofservice.component.html',
  styleUrls: ['./termsofservice.component.scss']
})
export class TermsofserviceComponent { }
