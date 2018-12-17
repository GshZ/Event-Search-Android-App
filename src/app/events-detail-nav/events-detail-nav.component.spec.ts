import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsDetailNavComponent } from './events-detail-nav.component';

describe('EventsDetailNavComponent', () => {
  let component: EventsDetailNavComponent;
  let fixture: ComponentFixture<EventsDetailNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsDetailNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsDetailNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
