import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueMain } from './boutique-main';

describe('BoutiqueMain', () => {
  let component: BoutiqueMain;
  let fixture: ComponentFixture<BoutiqueMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
