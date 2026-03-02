import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoutique } from './add-boutique';

describe('AddBoutique', () => {
  let component: AddBoutique;
  let fixture: ComponentFixture<AddBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
