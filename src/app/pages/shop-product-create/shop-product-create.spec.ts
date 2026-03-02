import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopProductCreate } from './shop-product-create';

describe('ShopProductCreate', () => {
  let component: ShopProductCreate;
  let fixture: ComponentFixture<ShopProductCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopProductCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopProductCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
