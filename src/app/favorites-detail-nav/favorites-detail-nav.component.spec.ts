import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesDetailNavComponent } from './favorites-detail-nav.component';

describe('FavoritesDetailNavComponent', () => {
  let component: FavoritesDetailNavComponent;
  let fixture: ComponentFixture<FavoritesDetailNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoritesDetailNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesDetailNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
