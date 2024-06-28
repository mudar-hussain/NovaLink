import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSigninBtnComponent } from './google-signin-btn.component';

describe('GoogleSigninBtnComponent', () => {
  let component: GoogleSigninBtnComponent;
  let fixture: ComponentFixture<GoogleSigninBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleSigninBtnComponent]
    });
    fixture = TestBed.createComponent(GoogleSigninBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
