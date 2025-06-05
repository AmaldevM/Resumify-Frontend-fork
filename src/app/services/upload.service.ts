import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // 🔄 Upload a resume
  uploadResume(userId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/resumes/upload/${userId}`, formData, {
      responseType: 'text'  // Expect plain text from backend
    });
  }

  // 📥 Get all resumes for a user
  getUserResumes(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/resumesByUserId?userId=${userId}`);
  }

  // 🗑️ Delete all resumes for a user
  deleteAllResumes(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${userId}`,{ responseType: 'text' });
  }
}
