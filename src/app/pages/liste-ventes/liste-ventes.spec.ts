import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeVentes } from './liste-ventes';

describe('ListeVentes', () => {
  let component: ListeVentes;
  let fixture: ComponentFixture<ListeVentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeVentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeVentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
