import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-resume-parser',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './parsedresume.component.html',
  styleUrl: './parsedresume.component.scss'
})
export class ParsedresumeComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  resumes: any[] = [];
  searchText: string = '';
  selectedExperienceRange: string = '';
  selectedSkill: string = '';
  showSortDropdown: boolean = false;
  showFilterDropdown: boolean = false;

  // 🔽 Skill filtering state
  skillSearch: string = '';
  allSkills: string[] = [];
  filteredSkillOptions: string[] = [];
  selectedSkills: string[] = [];

  constructor(private uploadService: UploadService) {}

  ngOnInit(): void {
    this.fetchResumes();
  }

  fetchResumes(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) return;

    const userId = parseInt(userIdStr, 10);
    this.uploadService.getUserResumes(userId).subscribe({
      next: (resumes: any[]) => {
        this.resumes = resumes;
        console.log('Fetched resumes:', this.resumes);

        const allSkills = resumes.flatMap((r: any) => r.skills || []);
        this.allSkills = Array.from(new Set(allSkills.map((s: string) => s.trim().toLowerCase())));
      },
      error: (err) => {
        console.error('Failed to fetch resumes', err);
      }
    });
  }

  toggleSortDropdown(): void {
    this.showSortDropdown = !this.showSortDropdown;
    this.showFilterDropdown = false;
  }

  toggleFilterDropdown(): void {
    this.showFilterDropdown = !this.showFilterDropdown;
    this.showSortDropdown = false;
  }

  setExperienceRange(range: string): void {
    this.selectedExperienceRange = range;
    this.showSortDropdown = false;
  }

  onSkillSearch(): void {
    const search = this.skillSearch.toLowerCase();
    this.filteredSkillOptions = this.allSkills.filter(
      skill => skill.includes(search) && !this.selectedSkills.includes(skill)
    );
  }

  addSkill(skill: string): void {
    this.selectedSkills.push(skill);
    this.skillSearch = '';
    this.filteredSkillOptions = [];
  }

  removeSkill(skill: string): void {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  }

  get filteredResumes(): any[] {
    return this.resumes.filter(resume => {
      const name = resume.name?.toLowerCase() || '';
      const resumeSkills: string[] = (resume.skills || []).map((s: string) => s.toLowerCase());
      const exp: number = resume.yearsOfExperience || 0;

      const matchesSearch =
        name.includes(this.searchText.toLowerCase()) ||
        resumeSkills.some(skill => skill.includes(this.searchText.toLowerCase()));

      let matchesExperience = true;
      switch (this.selectedExperienceRange) {
        case '0-1':
          matchesExperience = exp >= 0 && exp <= 1;
          break;
        case '1-2':
          matchesExperience = exp > 1 && exp <= 2;
          break;
        case '2-3':
          matchesExperience = exp > 2 && exp <= 3;
          break;
        case '3-5':
          matchesExperience = exp > 3 && exp <= 5;
          break;
        case '5+':
          matchesExperience = exp > 5;
          break;
      }

      const matchesSkills = this.selectedSkills.length === 0
        ? true
        : this.selectedSkills.every(skill => resumeSkills.includes(skill));

      return matchesSearch && matchesExperience && matchesSkills;
    });
  }

  deleteResume(index: number): void {
    this.resumes.splice(index, 1);
  }

  deleteAll(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      alert('User not logged in.');
      return;
    }
    const userId = parseInt(userIdStr, 10);

    if (!confirm("Are you sure you want to delete all resumes?")) return;

    this.uploadService.deleteAllResumes(userId).subscribe({
      next: () => {
        this.resumes = [];
        alert("All resumes deleted successfully.");
      },
      error: (error) => {
        console.error('Delete all failed:', error);
        alert("Failed to delete resumes.");
      }
    });
  }

  triggerFileUpload(): void {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      alert('User not logged in.');
      return;
    }
    const userId = parseInt(userIdStr, 10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    this.uploadService.uploadResume(userId, formData).subscribe({
      next: () => {
        console.log('Resume uploaded successfully');
        this.fetchResumes();
      },
      error: (error) => {
        console.error('Upload failed:', error);
        alert('Failed to upload resume.');
      }
    });
  }
}