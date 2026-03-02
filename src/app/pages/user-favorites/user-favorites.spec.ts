import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavorites } from './user-favorites';

describe('UserFavorites', () => {
  let component: UserFavorites;
  let fixture: ComponentFixture<UserFavorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFavorites]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFavorites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
