import { IRefreshTokenRequest } from './../models/i-refresh-token-request';
import { IAccessTokenResponse } from './../models/i-access-token-response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')

    const payload = new HttpParams()
      .set('username', model.username)
      .set('password', encodeURIComponent(model.password))
      .set('grant_type', model.grant_type);

    return this.http.post<IAccessTokenResponse>(`${environment.stsRoot}access-token`, payload, { headers: headers })
      .pipe(tap(result => this.setLocalStorage(result)));
  }

  postRefresh = (model: IRefreshTokenRequest) => {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')

    const payload = new HttpParams()
      .set('client_id', model.client_id)
      .set('client_secret', model.client_secret)
      .set('refresh_token', encodeURIComponent(model.refresh_token))
      .set('grant_type', model.grant_type);

    return this.http.post<IAccessTokenResponse>(`${environment.stsRoot}refresh-token`, payload, { headers: headers })
      .pipe(tap(result => this.setLocalStorage(result)));
  }

  private setLocalStorage(result: IAccessTokenResponse) {
    localStorage.setItem('token', result.access_Token);
    localStorage.setItem('refresh', result.refresh_Token);
  }
}


