import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from '../services/upload.service';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-profileview',
  standalone:true,
  templateUrl: './profileview.component.html',
  styleUrls: ['./profileview.component.scss'],
  imports:[CommonModule]
})
export class ProfileviewComponent implements OnInit {

   resume: any = null;
  resumeId!: number;
constructor(
    private route: ActivatedRoute,
    private uploadService: UploadService
  ) {}
  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const idParam = params.get('id');
    const userIdStr = localStorage.getItem('userId');

    if (!idParam || !userIdStr) return;

    this.resumeId = parseInt(idParam, 10);
    const userId = parseInt(userIdStr, 10);

    this.uploadService.getResumePreview(userId, this.resumeId).subscribe({
      next: (res: any) => {
        this.resume = res;
        if (this.resume?.skills && typeof this.resume.skills === 'string') {
          this.resume.skills = this.resume.skills.split(',').map((s: string) => s.trim());
        }
      },
      error: (err: any) => {
        console.error('Failed to load resume:', err);
      }
    });
  });
}
}
