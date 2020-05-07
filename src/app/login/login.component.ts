import { Component, OnInit } from '@angular/core';
import { IAccessTokenRequest } from '../models/i-access-token-request';
import { StsService } from '../services/sts.service';
import { IdentityService } from '../services/identity.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: IAccessTokenRequest = {
    username: null,
    password: null,
    grant_type: 'password'
  }

  constructor(private stsService: StsService, private identityService: IdentityService, private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
  }

  submit = () => this.stsService.postLogin(this.model).subscribe(res => {
    const jwt = this.jwtHelper.decodeToken(res.access_Token);
    this.identityService.getUser(jwt.unique_name).subscribe();
  });
}
