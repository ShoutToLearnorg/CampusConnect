import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = 'http://localhost:3000/api/community'; // Update with your backend API URL

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  createPost(post: { message: string, user: string }): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  likePost(postId: string, username: string): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${postId}/like`, { username });
  }

  dislikePost(postId: string, username: string): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${postId}/dislike`, { username });
  }

  addComment(postId: string, comment: { content: string, author: string }): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/comments`, comment);
  }

  replyToComment(postId: string, commentId: string, content: string, author: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/comments/${commentId}/reply`, { content, author });
  }

  // New method to get a post by ID
  getPostById(postId: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${postId}`);
  }
}
