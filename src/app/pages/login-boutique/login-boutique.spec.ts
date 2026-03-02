import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBoutique } from './login-boutique';

describe('LoginBoutique', () => {
  let component: LoginBoutique;
  let fixture: ComponentFixture<LoginBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
