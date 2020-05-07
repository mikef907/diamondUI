import { IRefreshTokenRequest } from './models/i-refresh-token-request';
import { StsService } from './services/sts.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, retry, tap, switchMap, first } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private jwtHelper: JwtHelperService, private stsService: StsService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.jwtHelper.tokenGetter()}`
      }
    });

    return next.handle(request).pipe(retry(1), catchError((error: HttpErrorResponse) => {
      console.log('Attempting Refresh...')

      const expired = error.headers.get("Token-Expired");

      if (error.status === 0) {
        const refreshModel: IRefreshTokenRequest = {
          client_id: '',
          refresh_token: localStorage.getItem('refresh'),
          client_secret: localStorage.getItem('token'),
          grant_type: 'refresh_token'
        }

        return this.stsService.postRefresh(refreshModel)
          .pipe(tap(() => console.log('Token Refreshed!')),
            switchMap(() => {

              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.jwtHelper.tokenGetter()}`
                }
              });

              return next.handle(request)
            }));
      }
      else {
        return throwError(error);
      }
    }));
  }
}
