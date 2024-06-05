import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        let clonedReq = req;
        if (token) {
          clonedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
        }
        console.log('Cloned request with token:', clonedReq);
        return next.handle(clonedReq).pipe(
          catchError((error) => {
            return this.handleError(error);
          })
        );
      })
    );
  }

  private handleError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      // Handle HTTP errors
      console.error('HTTP error occurred:', error);
      // You can modify the error message, log additional info, etc.
    } else {
      // Handle other types of errors
      console.error('Non-HTTP error occurred:', error);
    }
    // Return an observable that emits the error
    return throwError(error);
  }
}
