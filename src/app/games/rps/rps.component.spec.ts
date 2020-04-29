import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpsComponent } from './rps.component';

xdescribe('RpsComponent', () => {
  let component: RpsComponent;
  let fixture: ComponentFixture<RpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RpsComponent],
      imports: [
        HttpClientModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
