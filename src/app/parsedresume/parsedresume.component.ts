import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadService } from '../services/upload.service';
import { Router } from '@angular/router';

interface Resume {
  id: number;
  name: string;
  email: string;
  phone: string;
  jobPosition:string;
  skills: string[];
  totalExperienceYears: number;
  imageUrl?: string;  // for resume preview image URL
}

@Component({
  selector: 'app-resume-parser',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './parsedresume.component.html',
  styleUrl: './parsedresume.component.scss'
})
export class ParsedresumeComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  resumes: Resume[] = [];
  originalResumes: Resume[] = [];
  searchText: string = '';
  selectedExperienceRange: string = '';
  showSortDropdown: boolean = false;
  showFilterDropdown: boolean = false;

  skillSearch: string = '';
  allSkills: string[] = [];
  filteredSkillOptions: string[] = [];
  selectedSkills: string[] = [];


  isDeleting: boolean = false;  // To prevent double delete clicks

  constructor(private uploadService: UploadService, private router: Router) { }

  ngOnInit(): void {
    this.fetchResumes();
  }

  ngOnDestroy(): void {
    // Revoke created URLs to avoid memory leaks
    this.resumes.forEach(resume => {
      if (resume.imageUrl) {
        URL.revokeObjectURL(resume.imageUrl);
      }
    });
  }

 fetchResumes(): void {
  const userIdStr = localStorage.getItem('userId');
  if (!userIdStr) return;

  const userId = parseInt(userIdStr, 10);
  this.uploadService.getUserResumes(userId).subscribe({
    next: (resumes: any[] | null) => {
      console.log("Raw response from backend:", resumes);

      if (!resumes || !Array.isArray(resumes)) {
        this.resumes = [];
        return;
      }

      this.resumes = resumes.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        jobPosition: r.jobPosition,
        totalExperienceYears: r.totalExperienceYears,
        skills: typeof r.skills === 'string'
          ? r.skills.split(',').map((s: string) => s.trim().toLowerCase())
          : r.skills ?? [],
        imageUrl: undefined
      }));

      console.log("Mapped resumes for frontend:", this.resumes);


      const allSkills = this.resumes.flatMap(r => r.skills);
      this.allSkills = Array.from(new Set(allSkills));

      this.resumes.forEach(r => this.loadResumeImage(r.id));
    },
    error: (err) => {
      console.error('Failed to fetch resumes', err);
    }
  });
}

  loadResumeImage(resumeId: number): void {
    this.uploadService.getResumeImage(resumeId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const resume = this.resumes.find(r => r.id === resumeId);
        if (resume) resume.imageUrl = url;
      },
      error: () => {
        // No image or error, set imageUrl undefined or default if you want
        const resume = this.resumes.find(r => r.id === resumeId);
        if (resume) resume.imageUrl = undefined;
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
    this.filterResumes();
    this.showSortDropdown = false;
  }

  onSkillSearch(): void {
    const search = this.skillSearch.trim().toLowerCase();
    this.filteredSkillOptions = this.allSkills.filter(
      skill => skill.includes(search) && !this.selectedSkills.includes(skill)
    );
  }

  addSkill(skill: string): void {
    this.selectedSkills.push(skill);
    this.skillSearch = '';
    this.filteredSkillOptions = [];
    this.filterResumes();
  }

  removeSkill(skill: string): void {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
    this.filterResumes();
  }

  filterResumes(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) return;

    const userId = parseInt(userIdStr, 10);

    if (this.selectedSkills.length === 0 && !this.selectedExperienceRange) {
      this.fetchResumes();
      return;
    }

    if (this.selectedSkills.length > 0 && !this.selectedExperienceRange) {
      this.filterBySkillsOnly();
      return;
    }

    let startExp = 0.0;
    let endExp = 100.0;

    switch (this.selectedExperienceRange) {
      case 'none': this.fetchResumes(); break;
      case '0-1': startExp = 0.0; endExp = 1; break;
      case '1-2': startExp = 1; endExp = 2; break;
      case '2-3': startExp = 2; endExp = 3; break;
      case '3-5': startExp = 3; endExp = 5; break;
      case '5+': startExp = 5; endExp = 20; break;
    }

    this.uploadService.getResumesBySkillsAndExperience(userId, this.selectedSkills, startExp, endExp)
      .subscribe({
        next: (resumes: any[] | null) => {
          if (!resumes || !Array.isArray(resumes)) {
            this.resumes = [];
            return;
          }

          this.resumes = resumes.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            jobPosition:r.jobPosition,
            totalExperienceYears: r.totalExperienceYears,
            skills: typeof r.skills === 'string'
              ? r.skills.split(',').map((s: string) => s.trim().toLowerCase())
              : r.skills ?? [],
            imageUrl: undefined
          }));

          // Load images after filter
          this.resumes.forEach(r => this.loadResumeImage(r.id));

          this.applyAllFilters();
        },
        error: (err) => {
          console.error('Failed to filter resumes:', err);
        }
      });
  }

  filterBySkillsOnly(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) return;

    const userId = parseInt(userIdStr, 10);

    this.uploadService.getResumesBySkills(userId, this.selectedSkills).subscribe({
      next: (resumes: any[] | null) => {
        if (!resumes || !Array.isArray(resumes)) {
          this.resumes = [];
          return;
        }

        this.resumes = resumes.map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          jobPosition:r.jobPosition,
          totalExperienceYears: r.totalExperienceYears,
          skills: typeof r.skills === 'string'
            ? r.skills.split(',').map((s: string) => s.trim().toLowerCase())
            : r.skills ?? [],
          imageUrl: undefined
        }));

        // Load images after filter
        this.resumes.forEach(r => this.loadResumeImage(r.id));

        this.applyAllFilters();
      },
      error: (err) => {
        console.error('Skill-only filter failed:', err);
      }
    });
  }

  applyAllFilters(): void {
    const search = this.searchText.trim().toLowerCase();
    console.log(search)

    this.resumes = this.resumes.filter(resume => {
      const name = resume.name?.toLowerCase() || '';
      const resumeSkills = resume.skills.map(s => s.toLowerCase());
      console.log(name.includes(search));
      return name.includes(search) || resumeSkills.some(skill => skill.includes(search));
    });
  }

  get filteredResumes(): Resume[] {
    return this.resumes;
  }

  deleteResume(index: number): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      alert('User not logged in.');
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const resumeToDelete = this.resumes[index];

    if (!resumeToDelete || !resumeToDelete.id) {
      console.error('Resume ID is missing or undefined:', resumeToDelete);
      alert('Cannot delete this resume. Invalid ID.');
      return;
    }

    const resumeId = resumeToDelete.id;

    this.uploadService.deleteSingleResume(userId, resumeId).subscribe({
      next: () => {
        console.log(`Resume with ID ${resumeId} deleted`);
        this.resumes.splice(index, 1);
      },
      error: (error) => {
        console.error('Resume delete failed:', error);
        alert('Failed to delete resume.');
      }
    });
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

  goToResumeDetail(id: number): void {
  this.router.navigate(['/resume-preview',id]);
}

  clearFilters(): void {
    this.searchText = '';
    this.selectedSkills = [];
    this.selectedExperienceRange = '';
    this.fetchResumes();
  }

  triggerFileUpload(): void {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event): void {
  const files = (event.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const userIdStr = localStorage.getItem('userId');
  if (!userIdStr) {
    alert('User not logged in.');
    return;
  }

  const userId = parseInt(userIdStr, 10);

  Array.from(files).forEach((file) => {
    if (file.type !== 'application/pdf') {
      console.warn(`${file.name} is not a PDF, skipping.`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    this.uploadService.uploadResume(userId, formData).subscribe({
      next: () => {
        console.log(`Resume ${file.name} uploaded successfully`);
        this.fetchResumes();
      },
      error: (error) => {
        console.error(`Upload failed for ${file.name}:`, error);
        alert(`Failed to upload ${file.name}.`);
      }
    });
  });

}
}






























// import { NgFor, NgIf } from '@angular/common';
// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { UploadService } from '../services/upload.service';

// @Component({
//   selector: 'app-resume-parser',
//   standalone: true,
//   imports: [FormsModule, NgIf, NgFor],
//   templateUrl: './parsedresume.component.html',
//   styleUrl: './parsedresume.component.scss'
// })
// export class ParsedresumeComponent implements OnInit {
//   @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

//   resumes: any[] = [];
//   searchText: string = '';
//   selectedExperienceRange: string = '';
//   selectedSkill: string = '';
//   showSortDropdown: boolean = false;
//   showFilterDropdown: boolean = false;

//   // 🔽 Skill filtering state
//   skillSearch: string = '';
//   allSkills: string[] = [];
//   filteredSkillOptions: string[] = [];
//   selectedSkills: string[] = [];

//   constructor(private uploadService: UploadService) {}

//   ngOnInit(): void {
//     this.fetchResumes();
//   }

//   fetchResumes(): void {
//     const userIdStr = localStorage.getItem('userId');
//     if (!userIdStr) return;

//     const userId = parseInt(userIdStr, 10);
//     this.uploadService.getUserResumes(userId).subscribe({
//       next: (resumes: any[]) => {
//         this.resumes = resumes;
//         console.log('Fetched resumes:', this.resumes);

//         const allSkills = resumes.flatMap((r: any) => r.skills || []);
//         this.allSkills = Array.from(new Set(allSkills.map((s: string) => s.trim().toLowerCase())));
//       },
//       error: (err) => {
//         console.error('Failed to fetch resumes', err);
//       }
//     });
//   }

//   toggleSortDropdown(): void {
//     this.showSortDropdown = !this.showSortDropdown;
//     this.showFilterDropdown = false;
//   }

//   toggleFilterDropdown(): void {
//     this.showFilterDropdown = !this.showFilterDropdown;
//     this.showSortDropdown = false;
//   }

//   setExperienceRange(range: string): void {
//     this.selectedExperienceRange = range;
//     this.showSortDropdown = false;
//   }

//   onSkillSearch(): void {
//     const search = this.skillSearch.toLowerCase();
//     this.filteredSkillOptions = this.allSkills.filter(
//       skill => skill.includes(search) && !this.selectedSkills.includes(skill)
//     );
//   }

//   addSkill(skill: string): void {
//     this.selectedSkills.push(skill);
//     this.skillSearch = '';
//     this.filteredSkillOptions = [];
//   }

//   removeSkill(skill: string): void {
//     this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
//   }

//   get filteredResumes(): any[] {
//     return this.resumes.filter(resume => {
//       const name = resume.name?.toLowerCase() || '';
//       const resumeSkills: string[] = (resume.skills || []).map((s: string) => s.toLowerCase());
//       const exp: number = resume.yearsOfExperience || 0;

//       const matchesSearch =
//         name.includes(this.searchText.toLowerCase()) ||
//         resumeSkills.some(skill => skill.includes(this.searchText.toLowerCase()));

//       let matchesExperience = true;
//       switch (this.selectedExperienceRange) {
//         case '0-1':
//           matchesExperience = exp >= 0 && exp <= 1;
//           break;
//         case '1-2':
//           matchesExperience = exp > 1 && exp <= 2;
//           break;
//         case '2-3':
//           matchesExperience = exp > 2 && exp <= 3;
//           break;
//         case '3-5':
//           matchesExperience = exp > 3 && exp <= 5;
//           break;
//         case '5+':
//           matchesExperience = exp > 5;
//           break;
//       }

//       const matchesSkills = this.selectedSkills.length === 0
//         ? true
//         : this.selectedSkills.every(skill => resumeSkills.includes(skill));

//       return matchesSearch && matchesExperience && matchesSkills;
//     });
//   }

//   deleteResume(index: number): void {
//     this.resumes.splice(index, 1);
//   }

//   deleteAll(): void {
//     const userIdStr = localStorage.getItem('userId');
//     if (!userIdStr) {
//       alert('User not logged in.');
//       return;
//     }
//     const userId = parseInt(userIdStr, 10);

//     if (!confirm("Are you sure you want to delete all resumes?")) return;

//     this.uploadService.deleteAllResumes(userId).subscribe({
//       next: () => {
//         this.resumes = [];
//         alert("All resumes deleted successfully.");
//       },
//       error: (error) => {
//         console.error('Delete all failed:', error);
//         alert("Failed to delete resumes.");
//       }
//     });
//   }

//   triggerFileUpload(): void {
//     this.fileInputRef.nativeElement.click();
//   }

//   onFileSelected(event: Event): void {
//     const file = (event.target as HTMLInputElement).files?.[0];
//     if (!file) return;

//     if (file.type !== 'application/pdf') {
//       alert('Please upload a PDF file.');
//       return;
//     }

//     const userIdStr = localStorage.getItem('userId');
//     if (!userIdStr) {
//       alert('User not logged in.');
//       return;
//     }
//     const userId = parseInt(userIdStr, 10);

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('userId', userId.toString());

//     this.uploadService.uploadResume(userId, formData).subscribe({
//       next: () => {
//         console.log('Resume uploaded successfully');
//         this.fetchResumes();
//       },
//       error: (error) => {
//         console.error('Upload failed:', error);
//         alert('Failed to upload resume.');
//       }
//     });
//   }
// }
