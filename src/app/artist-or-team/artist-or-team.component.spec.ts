import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistOrTeamComponent } from './artist-or-team.component';

describe('ArtistOrTeamComponent', () => {
  let component: ArtistOrTeamComponent;
  let fixture: ComponentFixture<ArtistOrTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistOrTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistOrTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
