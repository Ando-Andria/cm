import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBoutique } from './details-boutique';

describe('DetailsBoutique', () => {
  let component: DetailsBoutique;
  let fixture: ComponentFixture<DetailsBoutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsBoutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsBoutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
