import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContrat } from './add-contrat';

describe('AddContrat', () => {
  let component: AddContrat;
  let fixture: ComponentFixture<AddContrat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContrat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContrat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
