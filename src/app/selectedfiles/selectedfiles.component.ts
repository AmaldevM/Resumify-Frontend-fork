import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UploadService } from '../services/upload.service';
import { ResumeTransferService } from '../services/resume-transfer.service';
import { LoadingService } from '../services/LoadingService'; // ✅ Import

@Component({
  selector: 'app-selected-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selectedfiles.component.html',
  styleUrls: ['./selectedfiles.component.scss']
})
export class SelectedFilesComponent {
  fileName: string = '';
  selectedFile!: File;

  constructor(
    private router: Router,
    private uploadService: UploadService,
    private resumeTransferService: ResumeTransferService,
    private loadingService: LoadingService // ✅ Inject
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state as { fileName?: string };
    if (state?.fileName) {
      this.fileName = state.fileName;
    }

    const file = this.resumeTransferService.getFile();
    if (file) {
      this.selectedFile = file;
    } else {
      alert('No file found. Please upload again.');
      this.router.navigate(['/']);
    }
  }

  onSelectNewFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  continue() {
    if (!this.selectedFile) {
      alert('No file selected!');
      return;
    }

    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      alert('User ID not found. Please login again.');
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.loadingService.setLoading(true); // ✅ Start loading

    this.uploadService.uploadResume(userId, formData).subscribe({
      next: (res) => {
        console.log('Upload successful:', res);
        this.resumeTransferService.clearFile();
        this.router.navigate(['/parsedresumes'], { state: { fileName: this.fileName } });
        // Loading will stop automatically via app.component route transition logic
      },
      error: (err) => {
        console.error('Upload failed:', err);
        alert('Failed to upload file');
        this.loadingService.setLoading(false); // ✅ Stop loading on error
      }
    });
  }
}
