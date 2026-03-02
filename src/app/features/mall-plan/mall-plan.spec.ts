import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MallPlan } from './mall-plan';

describe('MallPlan', () => {
  let component: MallPlan;
  let fixture: ComponentFixture<MallPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MallPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MallPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
