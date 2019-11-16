import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { ChartComponent } from './components/chart/chart.component';

import { RealtimeComponent } from './pages/realtime/realtime.component';
import { ChartviewComponent } from './pages/chartview/chartview.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { FiredbService } from './services/firedb.service';
import { RealtimeplanimetryComponent } from './pages/realtimeplanimetry/realtimeplanimetry.component';
import { ChartpieComponent } from './components/chartpie/chartpie.component';
import { AvgtableComponent } from './components/avgtable/avgtable.component';


const appRoutes: Routes = [
  { path: 'charts', component: ChartviewComponent },
  { path: 'realtime', component: RealtimeComponent },
  { path: 'planimetry', component: RealtimeplanimetryComponent },
  { path: '',   redirectTo: '/charts', pathMatch: 'full' }
  ,
];

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    RealtimeComponent,
    ChartviewComponent,
    NavbarComponent,
    RealtimeplanimetryComponent,
    ChartpieComponent,
    AvgtableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [
    FiredbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
