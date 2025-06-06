import { Component } from '@angular/core';
import { FooterComponent } from '../../footer.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-gdrp-ccpa',
  standalone: true,
  imports: [FooterComponent, CommonModule, MatIcon],
  templateUrl: './gdrp-ccpa.component.html',
  styleUrls: ['./gdrp-ccpa.component.scss']
})
export class GDRPCCPAComponent { }
