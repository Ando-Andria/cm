import { TestBed } from '@angular/core/testing';

import { ListeCart } from './liste-cart';

describe('ListeCart', () => {
  let service: ListeCart;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeCart);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
