import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventPageComponent } from './event-page/event-page.component';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    AppComponent,
    EventPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule, 
    MatSelectModule,
    MatTabsModule,
    GoogleMapsModule,
    NgCircleProgressModule.forRoot({
      "backgroundColor": "#000000",
      "radius": 30,
      "maxPercent": 100,
      "outerStrokeColor": "#ff0000",
      "outerStrokeGradientStopColor": "#ff0000",
      "innerStrokeColor": "#ff0000",
      "titleColor": "#ffffff",
      "animation": false,
      "animateTitle": false,
      "showSubtitle": false,
      "showUnits": false,
      "showBackground": false,
      "showInnerStroke": false,
      "responsive": false,
      "startFromZero": false,
      "showZeroOuterStroke": false})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }