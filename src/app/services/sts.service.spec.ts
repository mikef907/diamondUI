import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { StsService } from './sts.service';

xdescribe('StsService', () => {
  let service: StsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(StsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
