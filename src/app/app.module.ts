import { PassDataService } from './pass-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';
import { RoundProgressModule} from 'angular-svg-round-progressbar';
import { NgProgressModule } from '@ngx-progressbar/core';
import { MatTabsModule, MatAutocompleteModule, MatDialog, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchTableComponent } from './search-table/search-table.component';
import { EventsTableComponent } from './events-table/events-table.component';
import { EventsDetailNavComponent } from './events-detail-nav/events-detail-nav.component';
import { EventDetailComponent, DialogOverviewExampleDialogComponent } from './event-detail/event-detail.component';
import { ProgressComponent } from './progress/progress.component';
import { ModalService } from './modal.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ArtistOrTeamComponent } from './artist-or-team/artist-or-team.component';
import { VenueTableComponent } from './venue-table/venue-table.component';
import { UpcomingEventComponent } from './upcoming-event/upcoming-event.component';
import { OrderPipe } from './order.pipe';
import { AgmCoreModule } from '@agm/core';
import { FavoritesDetailNavComponent } from './favorites-detail-nav/favorites-detail-nav.component';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchTableComponent,
    EventsTableComponent,
    EventsDetailNavComponent,
    EventDetailComponent,
    ProgressComponent,
    ArtistOrTeamComponent,
    VenueTableComponent,
    UpcomingEventComponent,
    OrderPipe,
    FavoritesDetailNavComponent,
    FavoritesComponent,
    DialogOverviewExampleDialogComponent,
  ],
  entryComponents: [DialogOverviewExampleDialogComponent],
  imports: [
    MatSelectModule,
    // MatCardImage,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    // FormGroup,
    // NgControl,
    NgbModalModule,
    MatTabsModule,
    BrowserAnimationsModule,
    RoundProgressModule,
    NgProgressModule.forRoot(),
    HttpClientModule,
    MatAutocompleteModule,
    // MatTabsModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.

    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, { dataEncapsulation: false }
    // ),
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDongkyvMdQtin6IlrL2pLkmV40P5_nLDE',
    }),
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    MatDialog,
    // NgControl,
    ModalService,
    PassDataService,
    SearchTableComponent,
    ProgressComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
