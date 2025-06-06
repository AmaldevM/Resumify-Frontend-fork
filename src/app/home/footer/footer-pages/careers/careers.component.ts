import { Component } from '@angular/core';
import { FooterComponent } from "../../footer.component";

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent { }
