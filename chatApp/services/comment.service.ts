import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:3000/api/posts'; // Ensure this URL matches your backend

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createPost(postData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, postData);
  }

  addComment(postId: string, commentData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${postId}/comments`, commentData);
  }

  addReply(postId: string, commentId: string, replyData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${postId}/comments/${commentId}/replies`, replyData);
  }
}
