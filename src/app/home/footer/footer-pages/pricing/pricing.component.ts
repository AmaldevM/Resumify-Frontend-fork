import { Component } from '@angular/core';
import { FooterComponent } from '../../footer.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent { }
