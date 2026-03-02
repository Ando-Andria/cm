import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCategory } from './liste-category';

describe('ListeCategory', () => {
  let component: ListeCategory;
  let fixture: ComponentFixture<ListeCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
