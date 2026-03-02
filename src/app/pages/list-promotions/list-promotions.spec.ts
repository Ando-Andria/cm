import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPromotions } from './list-promotions';

describe('ListPromotions', () => {
  let component: ListPromotions;
  let fixture: ComponentFixture<ListPromotions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPromotions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPromotions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
