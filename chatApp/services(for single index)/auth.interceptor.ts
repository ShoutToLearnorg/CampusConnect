import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Adjust the path as necessary

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>(observer => {
      this.authService.getToken().then(token => {
        if (token) {
          const cloned = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          next.handle(cloned).subscribe(
            event => observer.next(event),
            err => observer.error(err),
            () => observer.complete()
          );
        } else {
          next.handle(req).subscribe(
            event => observer.next(event),
            err => observer.error(err),
            () => observer.complete()
          );
        }
      });
    });
  }
}
