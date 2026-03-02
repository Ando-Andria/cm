import { TestBed } from '@angular/core/testing';

import { NotificationsServices } from './notifications-services';

describe('NotificationsServices', () => {
  let service: NotificationsServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
