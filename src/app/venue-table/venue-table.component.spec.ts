import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueTableComponent } from './venue-table.component';

describe('VenueTableComponent', () => {
  let component: VenueTableComponent;
  let fixture: ComponentFixture<VenueTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
