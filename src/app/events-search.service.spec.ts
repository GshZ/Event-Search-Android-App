import { TestBed } from '@angular/core/testing';

import { EventsSearchService } from './events-search.service';

describe('EventsSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventsSearchService = TestBed.get(EventsSearchService);
    expect(service).toBeTruthy();
  });
});
