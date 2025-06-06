import { Component } from '@angular/core';
import { FooterComponent } from '../../footer.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [FooterComponent,CommonModule,MatIcon],
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent { }

