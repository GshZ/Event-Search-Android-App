import { TestBed } from '@angular/core/testing';

import { IpApiService } from './ip-api.service';

describe('IpApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IpApiService = TestBed.get(IpApiService);
    expect(service).toBeTruthy();
  });
});
