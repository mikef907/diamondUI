import { IRefreshTokenRequest } from './../models/i-refresh-token-request';
import { IAccessTokenResponse } from './../models/i-access-token-response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { IAccessTokenRequest } from '../models/i-access-token-request';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class StsService {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  postLogin = (model: IAccessTokenRequest) => {
    const payload = new HttpParams()
      .set('username', model.username)
      .set('password', model.password)
      .set('grant_type', model.grant_type);

    return this.http.post<IAccessTokenResponse>(`${environment.stsRoot}access-token`, payload)
      .pipe(tap(result => this.setLocalStorage(result)));
  }

  postRefresh = (model: IRefreshTokenRequest) => {
    const payload = new HttpParams()
      .set('client_id', model.client_id)
      .set('client_secret', model.client_secret)
      .set('refresh_token', model.refresh_token)
      .set('grant_type', model.grant_type);

    return this.http.post<IAccessTokenResponse>(`${environment.stsRoot}refresh-token`, payload)
      .pipe(tap(result => this.setLocalStorage(result)));
  }

  private setLocalStorage(result: IAccessTokenResponse) {
    localStorage.setItem('token', result.access_Token);
    localStorage.setItem('refresh', result.refresh_Token);
  }
}


