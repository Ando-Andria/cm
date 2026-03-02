import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePromotions } from './create-promotions';

describe('CreatePromotions', () => {
  let component: CreatePromotions;
  let fixture: ComponentFixture<CreatePromotions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePromotions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePromotions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
