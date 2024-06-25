import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlshortenerComponent } from './urlshortener.component';

describe('UrlshortenerComponent', () => {
  let component: UrlshortenerComponent;
  let fixture: ComponentFixture<UrlshortenerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UrlshortenerComponent]
    });
    fixture = TestBed.createComponent(UrlshortenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
