import { TestBed } from '@angular/core/testing';

import { FiredbService } from './firedb.service';

describe('FiredbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FiredbService = TestBed.get(FiredbService);
    expect(service).toBeTruthy();
  });
});
