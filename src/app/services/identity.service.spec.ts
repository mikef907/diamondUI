import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { IdentityService } from './identity.service';

xdescribe('IdentityService', () => {
  let service: IdentityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(IdentityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
