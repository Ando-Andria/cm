import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsAssign } from './lots-assign';

describe('LotsAssign', () => {
  let component: LotsAssign;
  let fixture: ComponentFixture<LotsAssign>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotsAssign]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotsAssign);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
