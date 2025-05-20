import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-parsedresume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parsedresume.component.html',
  styleUrls: ['./parsedresume.component.scss']
})
export class ParsedresumeComponent implements OnInit {
  resumes: any[] = [];

  constructor(private uploadService: UploadService) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      alert('User not logged in.');
      return;
    }

    const userId = parseInt(userIdStr, 10);
    this.uploadService.getUserResumes(userId).subscribe({
      next: (resumes) => {
        this.resumes = resumes;
        console.log('Parsed resumes:', this.resumes);
      },
      error: (err) => {
        console.error('Failed to fetch resumes', err);
      }
    });
  }
}
