import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResumeTransferService } from '../services/resume-transfer.service';


@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browseresume.component.html',
  styleUrls: ['./browseresume.component.scss']
})
export class BrowseResumeComponent {
  selectedFile: File | null = null;
  dragOver = false;

  constructor(
    private router: Router,
    private resumeTransferService: ResumeTransferService // 👈 inject
  ) {}

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.resumeTransferService.setFile(file); // 👈 save file in service
      this.router.navigate(['/selectedfiles'], { state: { fileName: file.name } });
    }
  }

  onBrowseFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.resumeTransferService.setFile(file);
      console.log(file);// 👈 save file in service
      this.router.navigate(['/selectedfiles'], { state: { fileName: file.name ,data:file } });
    }
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  clearDragOver() {
    this.dragOver = false;
  }
}
