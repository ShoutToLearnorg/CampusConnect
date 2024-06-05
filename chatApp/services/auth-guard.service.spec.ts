import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let service: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isLoggedIn']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: spy },
      ]
    });
    service = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow activation if user is authenticated', async () => {
    authServiceSpy.getCurrentUser.and.returnValue(Promise.resolve());
    authServiceSpy.isLoggedIn.and.returnValue(true);
    const canActivate = await service.canActivate();
    expect(canActivate).toBeTrue();
  });

  it('should navigate to login if user is not authenticated', async () => {
    spyOn(router, 'navigate');
    authServiceSpy.getCurrentUser.and.returnValue(Promise.resolve());
    authServiceSpy.isLoggedIn.and.returnValue(false);
    const canActivate = await service.canActivate();
    expect(canActivate).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
