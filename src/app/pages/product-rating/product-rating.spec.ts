import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRating } from './product-rating';

describe('ProductRating', () => {
  let component: ProductRating;
  let fixture: ComponentFixture<ProductRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
